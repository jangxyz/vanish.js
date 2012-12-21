(function() {
    var $ = $;

    //
    var module = window['xyz-vanish'] || {
        bgcolorHistory: {},
        alone: null,
        insertedjQuery: null,
        installed: false
    };

    function notice(_arguments) {
        _arguments = Array.prototype.slice.apply(arguments);
        console.log.apply(console, _arguments);
    }

    function assertJquery(cb) {
        if (typeof jQuery === 'undefined') {
            // create new jquery
            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src',  'https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js');
            document.getElementsByTagName('head')[0].appendChild(script);
            //
            module.insertedjQuery = script;
            
            // callback
            function callbackWhenJqueried() {
                if (typeof jQuery !== 'undefined') {
                    $ = jQuery;
                    cb(); 
                    return;
                } 
                setTimeout(callbackWhenJqueried, 100);
            }
            setTimeout(callbackWhenJqueried, 100);
        } else {
            $ = jQuery;
            cb(jQuery);
        }
    }
    function getPathTo(element) {
        if (element.id !== '')
            return 'id("'+element.id+'")';
        if (element === document.body)
            return element.tagName;

        var ix = 0;
        var siblings = element.parentNode.childNodes;
        for (var i=0; i<siblings.length; i++) {
            var sibling = siblings[i];
            if (sibling === element)
                return getPathTo(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
            if (sibling.nodeType === 1 && sibling.tagName===element.tagName)
                ix++;
        }
    }

    // hide all sibling elements, starting from self to root
    function hitlist(el) {
        el = $(el);
        var dieScums = el.siblings().toArray();
        el.parentsUntil('body').each(function(i,x) {
            var siblings = $(x).siblings();
            dieScums = dieScums.concat(siblings.toArray());
        });
        return dieScums;
    }


    function vanishExcept(el) {
        var victims = hitlist(el);
        // disappear!
        $(victims)
            .addClass('xyz-vanish-victim')
            .animate({opacity: 0}, 'slow');

        var path = getPathTo(el);
        notice(victims.length, 'elements vanished except:', path);
        return path;
    }

    function reappear(path) {
        $('body .xyz-vanish-victim')
            .animate({opacity: 1}, 'fast')
            .removeClass('xyz-vanish-victim');
    }

    function revertEveryHighlights() {
        var prevPaths = Object.keys(module.bgcolorHistory);
        for (var i in prevPaths) {
            var path = prevPaths[i];
            var el   = module.bgcolorHistory[path].el;
            var originalBg = module.bgcolorHistory[path].bgcolor || 'white';
            $(el).css('background-color', originalBg);
            delete module.bgcolorHistory[path];
        }
    }

    function highlightHoveredElement(e) {
        revertEveryHighlights();
        // now highlight
        var el = e.target;
        var path = getPathTo(el);
        module.bgcolorHistory[path] = {
            el     : el,
            bgcolor: $(el).css('background-color')
        };
        $(el).css('background-color', 'rgba(255,0,0,0.2)');
    }

    function vanishOnClick(e) {
        if (module.alone === null) {
            module.alone = vanishExcept(e.target);
            //
            revertEveryHighlights();
            $('body *').unbind('mouseenter.xyz-vanish.highlighOnHover');
        } else {
            reappear(module.alone);
            //
            $('body *').bind('mouseenter.xyz-vanish.highlighOnHover', highlightHoveredElement);
            module.alone = null;
        }
        return false;
    }


    function installVanish() {
        // highlight on hover
        $('body *').bind('mouseenter.xyz-vanish.highlighOnHover', highlightHoveredElement);

        // vanish on click
        module.alone = null;
        $('body *').bind('click.xyz-vanish.vanishOnClick', vanishOnClick);

        // installed.
        module.installed = true;
    }

    function uninstallVanish() {
        // uninstall jquery if any
        if (module.insertedjQuery) {
            module.insertedjQuery.parentNode.removeChild(module.insertedjQuery);
        }

        // reset highlight
        revertEveryHighlights();
        $('body *').unbind('mouseenter.xyz-vanish.highlighOnHover');

        // reset click
        $('body *').unbind('click.xyz-vanish.vanishOnClick');

        module.installed = false;
        notice('uninstalled vanish');
    }

    function main() {
        assertJquery(function() {
            if (module.installed) {
                uninstallVanish();
                if (module.alone) {
                    reappear(module.alone);
                }
                delete window['xyz-vanish'];
            } else {
                installVanish();
                window['xyz-vanish'] = module;
            }
        });
    }
    main();
})();
