<!DOCTYPE html>
<html>
<head>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

<title>{% block title %}{% endblock %}{[title]}</title>
<meta name="description" content="{[description]}">
<meta name="keywords" content="{[keywords]}">
{% block head %}{% endblock %}
</head>
<body>
<div class="content-box">{% block main %}{% endblock %}</div>
</body>
<script src="https://cdn.bootcss.com/jquery/1.9.1/jquery.min.js"></script>
{% block footer %}{% endblock %}
</html>