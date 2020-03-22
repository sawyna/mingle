let inject = () => {
    let s = document.createElement('script');
    s.src = chrome.extension.getURL('mingle_scripts.bundle.js');
    (document.head||document.documentElement).appendChild(s);
    s.onload = function() {
        s.parentNode.removeChild(s);
    };
}

export default inject;