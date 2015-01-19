/**
 * Created by phinome on 1/16/15.
 */
/**
 * validate Rule :
 * {
 *      "selector": {
 *          <validator name>: <validator options>
 *      }
 * }
 *
 * For Example:
 *
 * {
 *      "#username": {
 *          required: true,
 *          email: true,
 *          length: {
 *              min: 6,
 *              min: 24
 *          }
 *      },
 *      ...
 * }
 */

define([
    'jquery'
], function ($) {
    "use strict";

    var V = {
        // Can add to this, eg a telephone validator
        type: {
            'noCheck': {
                ok: function () { return true; }
            },

            'required': {
                ok: function (value) {
                    var emptyString = $.type(value) === 'string' && $.trim(value) === '';
                    return value !== undefined && value !== null && !emptyString;
                },
                message: 'This field is required'
            },

            'email': {
                ok: function (value) {
                    var re = /[a-z0-9_]+@[a-z0-9_]+\.[a-z]{3}/i;
                    return re.test(value);
                },
                message: 'Invalid Email'
            }

        },

        /**
         *
         * @param config
         * {
     *   '<jquery-selector>': string | object | [ string ]
     * }
         */
        validate: function (config) {

            // 1. Normalize the configuration object
            config = normalizeConfig(config);


            var promises = [],
                checks = [];

            // 2. Convert each validation to a promise
            $.each(config, function (selector, obj) {
                var retVal;
                $.each(obj, function(type) {
                    retVal = getValidator(type).ok($(selector).val());
                    // Make a promise, check is based on Promises/A+ spec
                    if (retVal.then) {
                        promises.push(retVal);
                    }
                    else {
                        var p = $.Deferred();

                        if (retVal) p.resolve();
                        else p.reject();

                        promises.push(p.promise());
                    }

                    checks.push({
                        filed: selector,
                        error: obj
                    });
                });
            });


            // 3. Wrap into a master promise
            var masterPromise = $.Deferred();
            $.when.apply(null, promises)
                .done(function () {
                    masterPromise.resolve();
                })
                .fail(function () {
                    var failed = [];
                    $.each(promises, function (idx, x) {
                        if (x.state() === 'rejected') {
                            var failedCheck = checks[idx];
                            var error = {
                                check: failedCheck.checkName,
                                error: failedCheck.check.message,
                                field: failedCheck.field,
                                control: failedCheck.control
                            };
                            failed.push(error);
                        }
                    });
                    masterPromise.reject(failed);
                });


            // 4. Return the master promise
            return masterPromise.promise();
        }
    };


    /**
     *
     * @param config
     * @returns {Array}
     */
    function normalizeConfig(config) {
        config = config || {};

        $.each(config, function (selector, o) {
            // ensure selector exist
            if( !$.is(selector) ) {
                throw new Error("The selector" + selector + "is not existed.");
            }
            if( $.isEmptyObject(o) ) {
                throw new Error("The Validate Rule is a empty object.");
            }

        });

    }

    function getValidator(type) {
        if ($.type(type) === 'string' && V.type[type]) return V.type[type];

        return V.noCheck;
    }

    return V;
});