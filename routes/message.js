var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/config');
var ua = require('mobile-agent');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.user) {
        var agent = ua(req.headers['user-agent']),
            pn = req.query.page || 1,
            userid = req.session.user.userID,
            status = req.query.status || 1,
            mtype = req.query.mtype || 1;
            request(config.server + "?service=User.ShowMessage&user_id=" + userid + "&pn=" + pn + "&status=" + status + "&mtype=" + mtype,
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var result = JSON.parse(body);
                    //console.log(result);
                    if (result.ret == 200) {
                        if (mtype == 3) {
                            var page = agent.Mobile ? 'messageMobile' : 'message';
                            res.render(page, {
                                result: result.data,
                                title: '消息中心',
                                'user': req.session.user
                            });
                        }else {
                            var page = agent.Mobile ? 'replyMobile' : 'reply';
                            res.render(page, {
                                result: result.data,
                                title: '消息中心',
                                'user': req.session.user,
                                'mtype': mtype
                            }); 
                        }
                    } else {
                        res.render('error', {
                            'message': result.msg,
                            error: {
                                'status': result.ret,
                                'stack': ''
                            }
                        });
                    }
                } else {
                    console.error('group failed:', error);
                    next(error);
                }
            }
        );
    }
    else {
        res.redirect('/login');
    }
});

module.exports = router;
