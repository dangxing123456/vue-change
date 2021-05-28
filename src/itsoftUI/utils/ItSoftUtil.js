const ItSoftUtil = {
    //日期快捷方式
    getDateList:function(){
        return [
            {label: '自定义', value: 'none'},
            {label: '今天', value: 'today'},
            {label: '本月', value: 'thisMonth'},
            {label: '上个月', value: 'lastMonth'},
            {label: '最近7天', value: 'lastDays7'},
            {label: '最近30天', value: 'lastDays30'},
            {label: '本年', value: 'thisYear'},
        ]
    },
    //日期格式化
    dateFormat:function (d,fmt) {
        let o = {
            "M+": d.getMonth() + 1, //月份
            "d+": d.getDate(), //日
            "h+": d.getHours(), //小时
            "m+": d.getMinutes(), //分
            "s+": d.getSeconds(), //秒
            "q+": Math.floor((d.getMonth() + 3) / 3), //季度
            "S": d.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    /**
     * @description 日期增加天数
     * @param type {String} 类型 1 加 2 减
     * @param diff {Number} 加减几天
     * @param bTime {String} 初始值   未传初始值则默认当天日期
     * @returns 计算后日期
     */
    dateCalDay: function(type, diff, bTime) {
        let dOfMs = diff * (24 * 60 * 60 * 1000);
        let _date;
        if (!bTime) {
            _date = new Date(bTime);
        } else {
            _date = new Date();
        }
        let _ndate = new Date(_date.toLocaleDateString()).getTime();
        if (type == "1") {
            _ndate = _ndate + dOfMs;
        } else if (type == "2") {
            _ndate = _ndate - dOfMs;
        }
        _ndate = parseInt(_ndate) > 10000000000 ? parseInt(_ndate) : parseInt(_ndate) * 1000;
        return new Date(_ndate);
    },
    /**
     * @description 计算两个日期相差多少天
     * @param time1 {Date} 第一个日期
     * @param time2 {Date} 第二个日期
     * @returns 相差的天数
     */
    dateDiffDay: function(time1, time2) {
        if (typeof(time1) == "string") {
            time1 = new Date(time1.split(" ")[0]);
        }
        if (typeof(time2) == "string") {
            time2 = new Date(time2.split(" ")[0]);
        }
        // 一天有多少毫秒
        let dOfMs = (24 * 60 * 60 * 1000);

        // time1 距离起始日期多少天
        let diff1 = (time1.getTime() / dOfMs);

        // time2 距离起始日期多少天
        let diff2 = (time2.getTime() / dOfMs);

        // 计算差值
        let diffDay = parseInt(diff1 - diff2);
        return diffDay;
    },
};

export {ItSoftUtil}
