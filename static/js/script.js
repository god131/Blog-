window.onload=function(){
	var list=document.getElementById('list');
	var lis=list.children;
	var timer;//定时器
	//删除分享
	function removenode(node){
		node.parentNode.removeChild(node);
	}
	//分享点赞
	function praiseBox(box,elem){
		var praiseElement=box.getElementsByClassName('praises-total')[0];
		var oldTotal=parseInt(praiseElement.getAttribute('total'));
		var txt=elem.innerHTML;
		var newTotal;
		if (txt == '赞') {
			newTotal=oldTotal+1;
			praiseElement.innerHTML=(newTotal==1)?'我觉得很赞':'我和'+oldTotal+'个人觉得很赞';
			elem.innerHTML='取消赞';
		}else{//取消赞
			newTotal=oldTotal-1;
			praiseElement.innerHTML=(newTotal==0)?'':newTotal+'个人觉得很赞';
			elem.innerHTML='赞';
		}
		praiseElement.setAttribute('total',newTotal);
		praiseElement.style.display=(newTotal==0)?'none':'block';
	}
	function getTime(){
		var now=new Date();
		var y=now.getFullYear();
		var m=now.getMonth()+1;
		m=(m<10)?'0'+m:m;
		var d=now.getDate();
		var h=now.getHours();
		h=(h<10)?'0'+h:h;
		var mi=now.getMinutes();
		mi=(mi<10)?'0'+mi:mi;
		return y+'-'+m+'-'+d+" "+h+':'+mi;
	}
	//回复
	function replyBox(box){
		var textarea=box.getElementsByTagName('textarea')[0];
		var list=box.getElementsByClassName('comment-list')[0];
		var div=document.createElement('div');
		div.className='comment-box clearfix';
		var html='<img class="myhead" src="static/imgs/my.jpg" alt=""/>'+
                        '<div class="comment-content">'+
                            '<p class="comment-text"><span class="user">我：</span>'+textarea.value+'</p>'+
                            '<p class="comment-time">'+
                                getTime()+
                                '<a href="javascript:;" class="comment-praise" total="0" my="0" style="">赞</a>'+
                               ' <a href="javascript:;" class="comment-operate">删除</a>'+
                            '</p>';
        div.innerHTML=html;
        list.appendChild(div);
        textarea.value='';//清空输入框
        textarea.onblur();//失去焦点
	}
	//评论点赞
	function praiseReply(elem){
		var oldTotal=parseInt(elem.getAttribute('total'));
		var my=elem.getAttribute('my');
		var newTotal;
		if (my==0) {
			newTotal=oldTotal+1;
			elem.setAttribute('total',newTotal);
			elem.setAttribute('my',1);
			elem.innerHTML=newTotal+"  取消赞";
		}else{
			newTotal=oldTotal-1;
			elem.setAttribute('total',newTotal);
			elem.setAttribute('my',0);
			elem.innerHTML=newTotal==0?'赞':newTotal+' 赞';
		}
		elem.style.display=(newTotal==0)?'':'block';
	}
	//评论回复
	function commentReply(elem){
		var commentBox=elem.parentNode.parentNode.parentNode;//获取评论的容器
		var box=commentBox.parentNode.parentNode.parentNode;//获取分享的容器
		var textarea=box.getElementsByTagName('textarea')[0];
		var user=commentBox.getElementsByClassName('user')[0];
		if (elem.innerHTML=='回复') {
			textarea.onfocus();
			textarea.value='回复'+user.innerHTML;
			textarea.onkeyup();
		}else{//删除
			removenode(commentBox);

		}

	}
	for (var i = 0; i < lis.length; i++) {
		lis[i].onclick=function(e){
			e=e||window.event;//获取触发事件的对象，这里做浏览器的兼容
			var elem=e.srcElement||e.target;//获得触发元素!!!
			switch (elem.className){
				case 'close':
					removenode(elem.parentNode);
					break;
				case 'praise':
					praiseBox(elem.parentNode.parentNode.parentNode,elem);
					break;
				//回复按钮为灰色
				case 'btn btn-off':
					clearTimeout(timer);
					break;
				//回复按钮为蓝色
				case 'btn':
					replyBox(elem.parentNode.parentNode.parentNode);
					break;
				//评论点赞
				case 'comment-praise':
					praiseReply(elem);
				break;
				//评论回复
				case 'comment-operate':
				commentReply(elem);
				break;
			}
		}
		//输入框
		var textarea = lis[i].getElementsByTagName('textarea')[0];
		textarea.onfocus=function(){
			this.parentNode.className='text-box text-box-on';
			this.value=this.value=='评论…'?'':this.value;
			this.onkeyup();
		}
		textarea.onblur=function(){
			var me=this;
			timer=setTimeout(function(){
				me.parentNode.className='text-box';
			if (me.value=='') {
				me.value='评论…';
			}
		},400);
	}
		textarea.onkeyup=function(){
			var len=this.value.length;
			var btn=this.parentNode.children[1];//回复按钮
			var word=this.parentNode.children[2];
			if (len==0||len>140) {
				btn.className='btn btn-off';
			}else{
				btn.className='btn';
				word.innerHTML=len+'/140';
			}
		}
	}
}