# Vanish! - focus on current node on page

How to:

## Install

Create a bookmarklet into you bookmarks toolbar with the following code as url:

`javascript:(function(){var script=document.createElement('script');script.setAttribute('type','text/javascript');script.setAttribute('src','https://raw.github.com/jangxyz/vanish.js/master/vanish.js');if(typeof script!='undefined'){document.getElementsByTagName('head')[0].appendChild(script);}})();"`

## Use

1. On any page, click the bookmarklet to activate
2. Elements will be highlighted when hovered upon.
3. Click the element you want to focus on. Any other elements will disappear.
4. By clicking the element again, everyone will reappear.
5. To deactivate, run the bookmarklet once more.
