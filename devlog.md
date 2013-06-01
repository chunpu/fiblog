2013/6/1
==========
加入访问/cmd/pull可以自动git pull并更新blog功能。

重做小清新版fiblog

完全重构~

1. 取消pcs同步功能，自己同步blog（推荐svn git）

2. 更加专注css模板主题

3. 本身是一个模块，只有一个必要参数 blogpath（template可选）

字体大小
---------
我在调整字体大小的时候一直苦恼于title和markdown中h1,h2这些字体的大小关系
搞得快不行时猛然发现，在首页，所以preview字体一样大才是唯一的解决方案。
没有字体才是最整洁的呀~

相对路径和绝对路径
--------------
如何应付绝对地址和相对地址

比如网页该显示的绝对地址是`/css/style.css`

实际文件在`static/css/style`

脚本文件在`lib/app.js`

每次换地址麻烦至极

最好每次都写一个网页绝对地址转为实际地址的函数

	function v2rpath(vpath) {
		return path.join(__dirname, '../', vpath);
	}

v2rpath就是virtual to real path的缩写。

这个函数非常重要，有效的转化了网页中连接。

现在越发觉得模块要精益求精，每行都应该有它的理由，否则就是不优美，就应该被抛弃或重写。

为什么要明确区分这两个路径？

首先是因为执行路径不同 readfile使用的地址是process.cwd()的位置。

而我们有时希望是以相对dirname的位置。dirname可以使地址绝对化，这样不管怎样都不会读错路径。但是绝对路径是不能用在网页里的。网页中生成的链接必须是相对地址。

如果不明确区分这两种路径，以后很可能会一团浆糊。

由于大量使用`__dirname`，所以要使得所有使用到dirname的脚本都在`lib/`中

只有没有涉及`__dirname`的脚本才能放在`lib/subdir/`中。


解耦
---------
一个模块的用法应该只有一种，比如读文件，

preview
---------
如何做blog的preview？

preview就是还没有打开blog，在首页的博客部分预览。

上次看新浪博客，居然按字数的，就是说博客在首页一句话会断掉。但是这是很丑的，所以最好就是按行数。截取前n行。

这里的前n行指markdown的前n行，而不是html的前n行。因为markdown一般不会变态到`![]()`分行写吧。。

出现一个问题
-------
当我满心欢喜觉得差不多重做玩了fiblog的时候。发现在blog中的静态文件无法显示了。之前由于固定了blog/文件夹的位置，这些都是正常显示的。

但是在这次就不一样了，我们必须在所有blog子链接中前加上blog.因为这样才可以通过blog这个子链接区分本来的静态链接和blog文件夹。

比如原来的

 >`http://localhost/life/myidolyss.md`

需要变成

 >`http://localhost/blog/life/myidolyss.md`

事实上fiblog本来就是这样的。。

改完后发现又有bug。

两个链接都可以访问。这是在是奇葩









