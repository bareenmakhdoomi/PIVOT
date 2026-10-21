api.controller = function ($element, $timeout) {
    /* Mounts the PIVOT workspace (UI script x_enno_pivot.pivot_portal, loaded by the widget dependency). */
    var host = $element[0].querySelector('.x-enno-pivot-host');
    $timeout(function () {
        if (window.x_enno_pivot_portal && window.x_enno_pivot_portal.mount) {
            window.x_enno_pivot_portal.mount(host);
        } else {
            host.innerHTML = '<p style="padding:24px">PIVOT could not load its script. Ask your PIVOT admin to check the UI script x_enno_pivot.pivot_portal.</p>';
        }
    });
};
