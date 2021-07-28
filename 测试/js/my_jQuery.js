// 1. 给 $ 添加4个工具方法:
// * min(a, b) : 返回较小的值
// * max(c, d) : 返回较大的值
// * leftTrim() : 去掉字符串左边的空格
// * rightTrim() : 去掉字符串右边的空格
// 2. 给jQuery对象 添加3个功能方法:
// * checkAll() : 全选
// * unCheckAll() : 全不选
// * reverseCheck() : 全反选

$.extend({
    min: function (a, b) {
        return a < b ? a : b
    },
    max: function (a, b) {
        return a > b ? a : b
    },
    leftTrim: function (str) {
        return str.replace(/^\s*/, '')
    },
    rightTrim: function (str) {
        return str.replace(/ \s*$/, '')
    }
})
$.fn.extend({
    checkAll: function () {
        this.prop('checked', true)
    },
    uncheckAll: function () {
        this.prop('checked', false)
    },
    reverseCheck: function () {
        this.each(function () {
            this.checked = !this.checked
        })
    }
})
