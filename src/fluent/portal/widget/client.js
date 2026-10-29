api.controller = function ($element, $timeout) {
    /* Generated from client.template.js by scripts/build-portal-bundle.mjs – edit the template, not client.js.
       Loads the PIVOT workspace (UI script pivot_portal) for this exact build and mounts it. */
    var VERSION = '6e616d737183';
    var host = $element[0].querySelector('.x-enno-pivot-host');
    function fail() {
        host.innerHTML = '<p style="padding:24px">PIVOT could not load its script. Ask your PIVOT admin to check the UI script x_enno_pivot.pivot_portal.</p>';
    }
    function start() {
        var p = window.x_enno_pivot_portal;
        if (p && p.version === VERSION) p.mount(host); else fail();
    }
    var p = window.x_enno_pivot_portal;
    if (p && p.version === VERSION) { $timeout(start); return; }
    var s = document.createElement('script');
    s.src = '/pivot_portal.jsdbx?v=' + VERSION;
    s.onload = function () { $timeout(start); };
    s.onerror = function () { $timeout(fail); };
    document.head.appendChild(s);
};
