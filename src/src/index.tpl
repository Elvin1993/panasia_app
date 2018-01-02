<!doctype html>
<html lang="zh-CN" data-framework="react" data-scale="true">
<head>
  <meta charset="utf-8">
   <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="yes" name="apple-touch-fullscreen">
    <meta content="telephone=no,email=no" name="format-detection">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
  <title>{%=__TITLE__%}Pansia</title>
  {% for (var css in o.htmlWebpackPlugin.files.css) { %}
  <link rel="stylesheet" href="{%=o.webpackConfig.output.CDNBase%}{%=o.htmlWebpackPlugin.files.css[css] %}">
  {% } %}
 <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
 <script>
     if ('addEventListener' in document) {
       document.addEventListener('DOMContentLoaded', function() {
         FastClick.attach(document.body);
       }, false);
     }
     if(!window.Promise) {
       document.writeln('<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"'+'>'+'<'+'/'+'script>');
     }
   </script>
</head>

<body>
<div id="root"></div>
</body>
{% for (var chunk in o.htmlWebpackPlugin.files.chunks) { %}
<script src="{%=o.webpackConfig.output.CDNBase%}{%=o.htmlWebpackPlugin.files.chunks[chunk].entry %}" ></script>
{% } %}

{% if (__PROD__) { %}
<script type="text/javascript" src="cordova.js"></script>
{% } %}

</html>
