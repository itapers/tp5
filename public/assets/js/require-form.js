define(['jquery', 'bootstrap', 'upload', 'validator'], function($, undefined, Upload, Validator) {
    var Form = {
        config: {},
        events: {
            validator: function(form, success, error, submit) {
                if (!form.is("form"))
                    return;
                //绑定表单事件
                form.validator($.extend({
                    validClass: 'has-success',
                    invalidClass: 'has-error',
                    bindClassTo: '.form-group',
                    formClass: 'n-default n-bootstrap',
                    msgClass: 'n-right',
                    stopOnError: true,
                    display: function(elem) {
                        return $(elem).closest('.form-group').find(".control-label").text().replace(/\:/, '');
                    },
                    target: function(input) {
                        var $formitem = $(input).closest('.form-group'),
                            $msgbox = $formitem.find('span.msg-box');
                        if (!$msgbox.length) {
                            return [];
                        }
                        return $msgbox;
                    },
                    valid: function(ret) {
                        var that = this,
                            submitBtn = $(".layer-footer [type=submit]", form);
                        that.holdSubmit();
                        $(".layer-footer [type=submit]", form).addClass("disabled");
                        //验证通过提交表单
                        Form.api.submit($(ret), function(data, ret) {
                            that.holdSubmit(false);
                            submitBtn.removeClass("disabled");
                            if (typeof success === 'function') {
                                if (false === success.call($(this), data, ret)) {
                                    return false;
                                }
                            }
                            //提示及关闭当前窗口
                            var msg = ret.hasOwnProperty("msg") && ret.msg !== "" ? ret.msg : '操作成功！';
                            parent.Toastr.success(msg);
                            parent.$(".btn-refresh").trigger("click");
                            var index = parent.Layer.getFrameIndex(window.name);
                            parent.Layer.close(index);
                            return false;
                        }, function(data, ret) {
                            that.holdSubmit(false);
                            submitBtn.removeClass("disabled");
                            if (typeof error === 'function') {
                                if (false === error.call($(this), data, ret)) {
                                    return false;
                                }
                            }
                        }, submit);
                        return false;
                    }
                }, form.data("validator-options") || {}));

                //移除提交按钮的disabled类
                $(".layer-footer [type=submit],.fixed-footer [type=submit],.normal-footer [type=submit]", form).removeClass("disabled");
            },
            selectpicker: function(form) {
                //绑定select元素事件
                if ($(".selectpicker", form).size() > 0) {
                    require(['bootstrap-select', 'bootstrap-select-lang'], function() {
                        $('.selectpicker', form).selectpicker();
                    });
                }
            },
            selectpage: function(form) {
                //绑定selectpage元素事件
                if ($(".selectpage", form).size() > 0) {
                    require(['selectpage'], function() {
                        $('.selectpage', form).selectPage({
                            eAjaxSuccess: function(data) {
                                data.list = typeof data.rows !== 'undefined' ? data.rows : (typeof data.list !== 'undefined' ? data.list : []);
                                data.totalRow = typeof data.total !== 'undefined' ? data.total : (typeof data.totalRow !== 'undefined' ? data.totalRow : data.list.length);
                                return data;
                            }
                        });
                    });
                    //给隐藏的元素添加上validate验证触发事件
                    $(document).on("change", ".sp_hidden", function() {
                        $(this).trigger("validate");
                    });
                    $(document).on("change", ".sp_input", function() {
                        $(this).closest(".sp_container").find(".sp_hidden").trigger("change");
                    });
                    $(form).on("reset", function() {
                        setTimeout(function() {
                            $('.selectpage', form).selectPageClear();
                        }, 1);
                    });
                }
            },
            cxselect: function(form) {
                //绑定cxselect元素事件
                if ($("[data-toggle='cxselect']", form).size() > 0) {
                    require(['cxselect'], function() {
                        $.cxSelect.defaults.jsonName = 'name';
                        $.cxSelect.defaults.jsonValue = 'value';
                        $.cxSelect.defaults.jsonSpace = 'data';
                        $("[data-toggle='cxselect']", form).cxSelect();
                    });
                }
            },
            citypicker: function(form) {
                //绑定城市远程插件
                if ($("[data-toggle='city-picker']", form).size() > 0) {
                    require(['citypicker'], function() {});
                }
            },
            datetimepicker: function(form) {
                //绑定日期时间元素事件
                if ($(".datetimepicker", form).size() > 0) {
                    require(['bootstrap-datetimepicker'], function() {
                        var options = {
                            format: 'YYYY-MM-DD HH:mm:ss',
                            icons: {
                                time: 'fa fa-clock-o',
                                date: 'fa fa-calendar',
                                up: 'fa fa-chevron-up',
                                down: 'fa fa-chevron-down',
                                previous: 'fa fa-chevron-left',
                                next: 'fa fa-chevron-right',
                                today: 'fa fa-history',
                                clear: 'fa fa-trash',
                                close: 'fa fa-remove'
                            },
                            showTodayButton: true,
                            showClose: true
                        };
                        $('.datetimepicker', form).parent().css('position', 'relative');
                        $('.datetimepicker', form).datetimepicker(options);
                    });
                }
            },
            plupload: function(form) {
                //绑定plupload上传元素事件
                if ($(".plupload", form).size() > 0) {
                    Upload.api.plupload($(".plupload", form));
                }
            },
            faselect: function(form) {
                //绑定fachoose选择附件事件
                if ($(".fachoose", form).size() > 0) {
                    $(".fachoose", form).on('click', function() {
                        var that = this;
                        var multiple = $(this).data("multiple") ? $(this).data("multiple") : false;
                        var mimetype = $(this).data("mimetype") ? $(this).data("mimetype") : '';
                        parent.Hippo.api.open("general/attachment/select?element_id=" + $(this).attr("id") + "&multiple=" + multiple + "&mimetype=" + mimetype, '选择', {
                            callback: function(data) {
                                var button = $("#" + $(that).attr("id"));
                                var maxcount = $(button).data("maxcount");
                                var input_id = $(button).data("input-id") ? $(button).data("input-id") : "";
                                maxcount = typeof maxcount !== "undefined" ? maxcount : 0;
                                if (input_id && data.multiple) {
                                    var urlArr = [];
                                    var inputObj = $("#" + input_id);
                                    var value = $.trim(inputObj.val());
                                    if (value !== "") {
                                        urlArr.push(inputObj.val());
                                    }
                                    urlArr.push(data.url)
                                    var result = urlArr.join(",");
                                    if (maxcount > 0) {
                                        var nums = value === '' ? 0 : value.split(/\,/).length;
                                        var files = data.url !== "" ? data.url.split(/\,/) : [];
                                        var remains = maxcount - nums;
                                        if (files.length > remains) {
                                            Toastr.error('你最多还可以选择' + remains + '个文件');
                                            return false;
                                        }
                                    }
                                    inputObj.val(result).trigger("change");
                                } else {
                                    $("#" + input_id).val(data.url).trigger("change");
                                }
                            }
                        });
                        return false;
                    });
                }
            },
            fieldlist: function(form) {
                if ($(".fieldlist", form).size() > 0) {
                    $(".fieldlist", form).on("click", ".append", function() {
                        var rel = parseInt($(this).closest("dl").attr("rel")) + 1;
                        var name = $(this).closest("dl").data("name");
                        $(this).closest("dl").attr("rel", rel);
                        $('<dd class="form-inline"><input type="text" name="' + name + '[field][' + rel + ']" class="form-control" value="" size="10" /> <input type="text" name="' + name + '[value][' + rel + ']" class="form-control" value="" size="40" /> <span class="btn btn-sm btn-danger btn-remove"><i class="fa fa-times"></i></span> </dd>').insertBefore($(this).parent());
                    });
                    $(".fieldlist", form).on("click", "dd .btn-remove", function() {
                        $(this).parent().remove();
                    });
                    //拖拽排序
                    require(['dragsort'], function() {
                        //绑定拖动排序
                        $("dl.fieldlist", form).dragsort({
                            itemSelector: 'dd',
                            dragSelector: ".btn-dragsort",
                            dragEnd: function() {

                            },
                            placeHolderTemplate: "<dd></dd>"
                        });
                    });
                }
            },
            bindevent: function(form) {
                console.log('编辑器数量：', $(".editor").size())
                if ($(".editor").size() > 0) {
                    require(['summernote'], function() {
                        $(".editor", form).summernote({
                            height: 250,
                            lang: 'zh-CN',
                            fontNames: [
                                'Arial', 'Arial Black', 'Serif', 'Sans', 'Courier',
                                'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande',
                                "Open Sans", "Hiragino Sans GB", "Microsoft YaHei",
                                '微软雅黑', '宋体', '黑体', '仿宋', '楷体', '幼圆',
                            ],
                            fontNamesIgnoreCheck: [
                                "Open Sans", "Microsoft YaHei",
                                '微软雅黑', '宋体', '黑体', '仿宋', '楷体', '幼圆'
                            ],
                            toolbar: [
                                ['style', ['style', 'undo', 'redo']],
                                ['font', ['bold', 'underline', 'strikethrough', 'clear']],
                                ['fontname', ['color', 'fontname', 'fontsize']],
                                ['para', ['ul', 'ol', 'paragraph', 'height']],
                                ['table', ['table', 'hr']],
                                ['insert', ['link', 'picture', 'video']],
                                ['view', ['fullscreen', 'codeview', 'help']]
                            ],
                            dialogsInBody: true,
                            callbacks: {
                                onChange: function(contents) {
                                    $(this).val(contents);
                                    $(this).trigger('change');
                                },
                                onInit: function() {},
                                onImageUpload: function(files) {
                                    var that = this;
                                    //依次上传图片
                                    for (var i = 0; i < files.length; i++) {
                                        Upload.api.send(files[i], function(data) {
                                            var url = Hippo.api.cdnurl(data.url);
                                            $(that).summernote("insertImage", url, 'filename');
                                        });
                                    }
                                }
                            }
                        });
                    });
                }
            }
        },
        api: {
            submit: function(form, success, error, submit) {
                console.log(form)
                if (form.size() === 0)
                    return Toastr.error("表单未初始化完成,无法提交");
                if (typeof submit === 'function') {
                    if (false === submit.call(form)) {
                        return false;
                    }
                }
                var type = form.attr("method").toUpperCase();
                type = type && (type === 'GET' || type === 'POST') ? type : 'GET';
                url = form.attr("action");
                url = url ? url : location.href;
                //修复当存在多选项元素时提交的BUG
                // var params = {};
                // var multipleList = $("[name$='[]']");
                // if (multipleList.size() > 0) {
                //     var postFields = form.serializeArray().map(function (obj) {
                //         return $(obj).prop("name");
                //     });
                //     $.each(multipleList, function (i, j) {
                //         if (postFields.indexOf($(this).prop("name")) < 0) {
                //             params[$(this).prop("name")] = '';
                //         }
                //     });
                // }
                //调用Ajax请求方法
                Hippo.api.ajax({
                    type: type,
                    url: url,
                    data: new FormData(form[0]), //form.serialize() + (params ? '&' + $.param(params) : ''),
                    dataType: 'json',
                    contentType: false, //使用FormData获取表单数据的时候需要添加以下几项
                    processData: false,
                    complete: function(xhr) {
                        var token = xhr.getResponseHeader('__token__');
                        if (token) {
                            $("input[name='__token__']", form).val(token);
                        }
                    }
                }, function(data, ret) {
                    $('.form-group', form).removeClass('has-feedback has-success has-error');
                    if (data && typeof data === 'object') {
                        //刷新客户端token
                        if (typeof data.token !== 'undefined') {
                            $("input[name='__token__']", form).val(data.token);
                        }
                        //调用客户端事件
                        if (typeof data.callback !== 'undefined' && typeof data.callback === 'function') {
                            data.callback.call(form, data);
                        }
                    }
                    if (typeof success === 'function') {
                        if (false === success.call(form, data, ret)) {
                            return false;
                        }
                    }
                }, function(data, ret) {
                    if (data && typeof data === 'object' && typeof data.token !== 'undefined') {
                        $("input[name='__token__']", form).val(data.token);
                    }
                    if (typeof error === 'function') {
                        if (false === error.call(form, data, ret)) {
                            return false;
                        }
                    }
                });
                return false;
            },
            bindevent: function(form, success, error, submit) {

                form = typeof form === 'object' ? form : $(form);

                var events = Form.events;

                events.bindevent(form);

                events.validator(form, success, error, submit);

                events.selectpicker(form);

                events.selectpage(form);

                events.cxselect(form);

                events.citypicker(form);

                events.datetimepicker(form);

                events.plupload(form);

                events.faselect(form);

                events.fieldlist(form);
            },
            custom: {}
        },
    };
    return Form;
});