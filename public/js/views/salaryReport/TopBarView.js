define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/salaryReport/TopBarTemplate.html',
    'custom',
    'constants',
    'common',
    'moment'
], function (Backbone, $, _, ContentTopBarTemplate, Custom, CONSTANTS, common, moment) {
    'use strict';

    var TopBarView = Backbone.View.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.SALARYREPORT,
        template   : _.template(ContentTopBarTemplate),

        initialize: function (options) {
            if (options.collection) {
                this.collection = options.collection;
            }

            this.render();
        },

        events: {
            'click #updateDate': 'changeDateRange',
            'click .dateRange' : 'toggleDateRange',
            'click #cancelBtn' : 'cancel'
        },

        cancel: function (e) {
            var targetEl = $(e.target);
            var ul = targetEl.closest('ul.frameDetail');

            ul.addClass('hidden');
        },

        changeDateRange: function (e) {
            var targetEl = $(e.target);
            var dateFilter = targetEl.closest('ul.dateFilter');
            var startDate = dateFilter.find('#startDate');
            var endDate = dateFilter.find('#endDate');
            var startTime = dateFilter.find('#startTime');
            var endTime = dateFilter.find('#endTime');

            startDate = startDate.val();
            endDate = endDate.val();

            startTime.text(startDate);
            endTime.text(endDate);

            Custom.cacheToApp('salaryReportDateRange', {
                startDate: startDate,
                endDate  : endDate
            });

            this.trigger('changeDateRange');
            this.toggleDateRange(e);
        },

        toggleDateRange: function (e) {
            var targetEl = $(e.target);
            var ul = targetEl.closest('ul');

            if (!ul.hasClass('frameDetail')) {
                ul.find('.frameDetail').toggleClass('hidden');
            } else {
                ul.toggleClass('hidden');
            }
        },

        hideDateRange: function () {
            var targetEl = this.$el.find('.frameDetail');

            targetEl.addClass('hidden');
        },

        bindDataPickers: function (startDate, endDate) {
            var self = this;

            this.$el.find('#startDate')
                .datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    defaultDate: startDate,
                    onSelect   : function () {
                        var targetInput = $(this);
                        var endDatePicker = self.$endDate;
                        var endD = moment(targetInput.datepicker('getDate'));

                        endD.add(1, 'month').day('Monday');
                        endD = endD.toDate();

                        endDatePicker.datepicker('option', 'minDate', endD);

                        return false;
                    }
                })
                .datepicker('setDate', startDate);
            this.$endDate = this.$el.find('#endDate')
                .datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    defaultDate: endDate
                })
                .datepicker('setDate', endDate);
        },

        render: function () {
            var dateRange = Custom.retriveFromCash('salaryReportDateRange');
            var viewType = Custom.getCurrentVT();

            $('title').text(this.contentType);

            this.startDate = common.utcDateToLocaleDate(dateRange.startDate);
            this.endDate = common.utcDateToLocaleDate(dateRange.endDate);

            this.$el.html(this.template({
                viewType   : viewType,
                contentType: this.contentType,
                startDate  : this.startDate,
                endDate    : this.endDate
            }));

            this.bindDataPickers(this.startDate, this.endDate);

            return this;
        }
    });

    return TopBarView;
});
