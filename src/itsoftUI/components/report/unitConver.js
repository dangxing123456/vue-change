const unitConver = {
    /**
     * 获取DPI
     * @returns {Array}
     */
    getDPI: function () {
        let arrDPI = new Array;
        if (window.screen.deviceXDPI) {
            arrDPI[0] = window.screen.deviceXDPI;
            arrDPI[1] = window.screen.deviceYDPI;
        } else {
            let tmpNode = document.createElement("DIV");
            tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            document.body.appendChild(tmpNode);
            arrDPI[0] = parseInt(tmpNode.offsetWidth);
            arrDPI[1] = parseInt(tmpNode.offsetHeight);
            tmpNode.parentNode.removeChild(tmpNode);
        }
        return arrDPI;
    },
    /**
     * px转换为mm
     * @param value
     * @returns {number}
     */
    px2Mm: function (value) {
        let inch = value / this.getDPI()[0];
        let c_value = inch * 25.4;
        return c_value;
    },
    /**
     * mm转换为px
     * @param value
     * @returns {number}
     */
    mm2Px: function (value) {
        let inch = value / 25.4;
        let c_value = inch * this.getDPI()[0];
        return c_value;
    },
    unit2Num:function (value) {
        if (value==="0" || !value ) return Number(0)
        return Number(value.substring(0,value.length-2))
    },
    NumFixed2:function (num) {
       return  Math.round(num * 100) / 100
    }
}
export {unitConver}


/**
 * 单位说明
 * 一、纸张尺寸
 * A4纸的尺寸：210×297mm
 * A3纸的尺寸：297×420mm
 *
 */

