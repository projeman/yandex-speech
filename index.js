/*
docs: http://api.yandex.ru/speechkit/cloud-api/doc/index.xml
*/

var YandexASR = function(options){

    var request = require('request');
    var qs = require('querystring');
    var fs = require('fs');
    var path = require('path');

    var yandex_asr_url = 'http://asr.yandex.net/asr_xml?';
    var yandex_developer_key = null;
    var yandex_user_uuid = null;
    var yandex_recognize_file = null;
    var yandex_recognize_filetype = 'audio/x-mpeg-3';
    var yandex_topic = 'freeform';
    var yandex_lang = 'ru-RU';

    var init = function(options){        
        yandex_developer_key = options['developer_key'];
        yandex_user_uuid = options['uuid'];
        yandex_recognize_file = options['file'];
        yandex_recognize_filetype = (options['filetype'])?options['filetype']:'audio/x-mpeg-3';
        yandex_topic = (options['topic'])?options['topic']:'freeform';
        yandex_lang = (options['lang'])?options['lang']:'ru-RU';
    }(options);

    var params = {
        uuid: yandex_user_uuid,
        key: yandex_developer_key,
        topic: yandex_topic,
        lang: yandex_lang
    };

    var full_url = yandex_asr_url + qs.stringify(params);

    var recognize = function(callback){
        
        var r = request.post({
                url: full_url,
                headers: {
                    'Transfer-Encoding': 'chunked'
                }
            }, 
            function (err, httpResponse, body) {
                callback(err, httpResponse, body)
            }
        );

        var form = r.form();
        form.append('Content-Type', yandex_recognize_filetype);
        form.append('audio', fs.createReadStream(path.join(__dirname, yandex_recognize_file)));            
    }

    return {
        recognize: recognize,        
    }
};

module.exports = YandexASR;