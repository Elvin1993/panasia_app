<!doctype html>
<html lang="zh-CN" data-framework="react" data-scale="true">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="renderer" content="webkit">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />

  <title>{%=__TITLE__%}智信 • 分享金融智慧</title>
  {% if (o.htmlWebpackPlugin.files.favicon) { %}
  <link rel="shortcut icon" href="{%=o.htmlWebpackPlugin.files.favicon%}">
  {% } %}
  {% for (var css in o.htmlWebpackPlugin.files.css) { %}
  <link rel="stylesheet" href="{%=o.htmlWebpackPlugin.files.css[css] %}">
  {% } %}
</head>

<body>
<div id="root"></div>
</body>

{% for (var chunk in o.htmlWebpackPlugin.files.chunks) { %}
<script src="{%=o.htmlWebpackPlugin.files.chunks[chunk].entry %}" crossorigin="anonymous"></script>
{% } %}


{% if (__PROD__) { %}
<script type="text/javascript" src="cordova.js"></script>
{% } %}
</html>
