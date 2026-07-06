(function () {

    document.addEventListener("DOMContentLoaded", setupWista);

    function setupWista() {
        const node = document.createElement("script");
        node.src = '//fast.wistia.com/assets/external/E-v1.js';
        node.async = "async";
        node.charset = "ISO-8859-1";
        document.getElementsByTagName('body')[0].appendChild(node);
    }

})();