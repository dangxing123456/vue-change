const PageStyle = {
    //页尺寸
    stylePageSize: function (data) {
        let style = "page-break-after:always;"
        style += "width:" + data.Width + ";"
        style += "height:100%;"
        return style
    },
    stylePreviePageSize: function (data) {
        let style = "page-break-after:always;"
        style += "width:" + data.Width + ";"
        //style += "height:" + data.Height + ";"
        return style
    },
    styleDesignPageSize: function (data) {
        let style = ""
        style += "width:" + data.Width + ";"
        style += "height:auto;"
        return style
    },
    styleRulerXSize: function (data) {
        let style = ""
        style += "width:" + data.Width + ";"
        return style
    },
    //页边距
    stylePageMargin: function (data) {
        let style = "margin:" + data.TopMargin + " " + " "
            + data.RightMargin + " "
            + data.BottomMargin + " "
            + data.LeftMargin + ";"
        return style
    },
    stylePageMargins: function (data) {
        let w = this.unit2Num(data.Width) + this.unit2Num(data.LeftMargin) + this.unit2Num(data.RightMargin)
        let h = this.unit2Num(data.Height) + this.unit2Num(data.TopMargin) + this.unit2Num(data.BottomMargin)
        let top = "top:" + data.TopMargin + ";left:0;height:1px; border-top: 1px dashed #ccc; width:" + w + "mm;"
        let left = "left:" + data.LeftMargin + ";top:0; width:1px;border-left: 1px dashed #ccc;height:" + h + "mm;"
        let right = "right:" + data.RightMargin + "; top:0; width:1px;border-right: 1px dashed #ccc;height:" + h + "mm;"
        let bottom = "bottom:" + data.BottomMargin + "; left:0;height:1px;border-bottom: 1px dashed #ccc;width:" + w + "mm;"
        return {top, left, right, bottom}
    },
    //页面头部
    stylePageHeader: function (data) {
        let style = "position:relative;overflow: hidden;width:100%;" +
            "height:" + data.height
        return style
    },
    //页面尾部
    stylePageFooter: function (data) {
        let style = "position:relative;overflow: hidden; bottom:0;width:100%;" +
            "height:" + data.height
        return style
    },
    styleNode: function (val) {
        let style = "position: absolute;"
        if (val.Top  && val.Top.length>0) style += "top:" + val.Top + ";"
        if (val.Left && val.Left.length>0) style += "left:" + val.Left + ";"
        // if (val.Right) style += "right:" + val.Right + ";"
        // if (val.Bottom) style += "bottom:" + val.Bottom + ";"
        if (val.Width) style += "width:" + val.Width + ";"
        if (val.Height) {
            style += "height:" + val.Height + ";"
            style+="line-height:"+ val.Height + ";"
        }
        if (val.FontSize) style += "font-size:" + val.FontSize + ";"
        if (val.FontFamily) style += "font-family:" + val.FontFamily+ ";"
        if (val.Color) style += "color:" + val.Color + ";"
        if (val.FontWeight) style += "font-weight:" + val.FontWeight + ";"
        if (val.FontStyle) style += "font-style:" + val.FontStyle + ";"
        if (val.TextDecoration) style += "text-decoration:" + val.TextDecoration + ";"
        if (val.TextAlign) style += "text-align:" + val.TextAlign + ";"
        if (val.BorderTop) style += "border-top:" + val.BorderTop + ";"
        if (val.BorderBottom) style += "border-bottom:" + val.BorderBottom + ";"
        if (val.BorderLeft) style += "border-left:" + val.BorderLeft + ";"
        if (val.BorderRight) style += "border-right:" + val.BorderRight + ";"
        if (val.BorderColor) style += "border-color:" + val.BorderColor + ";"
        if (val.BackgroundColor) style += "background-color:" + val.BackgroundColor + ";"
        if (val.BorderRadius) style += "border-radius:" + val.BorderRadius + ";"
        if (val.TransformOrigin) style += "transform-origin:" + val.TransformOrigin + ";"
        if (val.zIndex) style += "z-index:" + val.zIndex + ";"
        if (val.Padding) style += "padding-left:" + val.Padding + ";padding-right:" + val.Padding + ";"
        if (val.Transform) style += "transform:rotate(" + val.Transform + "rad);"
        return style
    },
    styleTD: function (val) {
        let style = "background-color: #ffffff;"
        if (val.Height) {
            style += "height:" + val.Height + "mm;"
        }
        if (val.FontSize) style += "font-size:" + val.FontSize + ";"
        if (val.FontFamily) style += "font-family:" + val.FontFamily+ ";"
        if (val.Color) style += "color:" + val.Color + ";"
        if (val.FontWeight) style += "font-weight:" + val.FontWeight + ";"
        if (val.FontStyle) style += "font-style:" + val.FontStyle + ";"
        if (val.TextDecoration) style += "text-decoration:" + val.TextDecoration + ";"
        if (val.TextAlign) style += "text-align:" + val.TextAlign + ";"
        if (val.Padding) style += "padding-left:" + val.Padding + "mm;padding-right:" + val.Padding + "mm;"
        if (val.Transform) style += "transform:rotate(" + val.Transform + "rad);"
        return style
    },
    //缩放
    stylePageScale(value){
        let style="transform:scale("+value+");"
        style+="-webkit-transform:scaleX("+value+");"
        style+="-moz-transform:scaleX("+value+");"
        return style
    },
    unit2Num: function (value) {
        return Number(value.substring(0, value.length - 2))
    }
}
export {PageStyle}
