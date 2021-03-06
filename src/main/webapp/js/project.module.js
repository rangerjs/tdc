var projectTemplate = [
						'<div class="project_name" pid=@{id} >',
							'<a class="project_delete_link" pid=@{id} onclick="deleteProject($(this))">删除</a>',
							'<a class="add function_add_link" onclick="showAddFunction($(this),@{id})">添加</a>',
							'<p>@{name}</p>',
						'</div>' 
					   ].join('');
var editProjectTemplate = [
                           '<div class="project_edit">',
								'<input type="text" class="project_name_edit" value="@{value}"/>',
								'<input type="button" pid=@{pid} class="project_update_bt" value="更新"/>',
								'<input type="button" class="project_cancle_update_bt" value="取消"/>',
							'</div>'
                           ].join('');
var addProjectTemplate = [
							'<div class="project_add">',
								'<input type="text" class="project_name_add" id="newProject"/>',
								'<input type="button" class="project_add_bt" onclick="addProject()" value="添加"/>',
								'<input type="button" class="project_cancle_add_bt" onclick="cancelAddProj()" value="取消"/>',
							'</div>'
                          ].join('');

(function loadProject(){
	var url = "/project/query";
	var projects = $.ajax({
		url : url,
		type : "get",
		async:false,
		dataType : "json"
	});
	
	projects.done(function(data){
		if(data.code == 1){
			var projects = data.data.projects;
			var projectList = [];
			projectList.push(addProjectTemplate);
			//$(".project_list").append(addProjectTemplate);
			
			$.each(projects,function(i){
				projectList.push(projectTemplate.format({name:autoAddEllipsis(projects[i].name,35)+'('+projects[i].fcount+')',id:projects[i].id}));
				projectList.push(editProjectTemplate.format({
									value:projects[i].name,
									pid:projects[i].id
								}));
				//$(".project_list").append(projectTemplate.format({name:autoAddEllipsis(projects[i].name,35)+'('+projects[i].fcount+')',id:projects[i].id}));
				//$(".project_list").append(editProjectTemplate.format({
				//	value:projects[i].name,
				//	pid:projects[i].id
				//}));
			});
			$(".project_list").append(projectList.join(''));
			addProjectEvent();
		}
	});
})();
//定义setTimeout执行方法
var pTimeFn = null;
function addProjectEvent(){
	$("div.project_name >p").dblclick(function(){
		clearTimeout(pTimeFn);
		//编辑项目
		var p = $(this).parent();
		p.hide();
		p.next().show();
		
		$(".project_update_bt").click(function(){
			var t = $(this);
			var pid = t.attr("pid");
			var pNm = t.prev().val();
			updateProject(t,pid,pNm);
		});
		
		$(".project_cancle_update_bt").click(function(){
			var p = $(this).parent();
			p.hide();
			p.prev().show();
		});
	});
	
	//添加显示隐藏模块事件
	$("div.project_name >p").die().live("click",function(){
		var p = $(this);
		var pParent = p.parent();
		// 取消上次延时未执行的方法
	    clearTimeout(pTimeFn);
	    //执行延时
	    pTimeFn = setTimeout(function(){
			var obj = pParent.children(".function_name");
			var addBt = pParent.children(".function_add_link");
			var funcAdd = pParent.children(".function_add");
			var funcEdit = pParent.children(".function_edit");
			if(obj.length==0){
				loadFunctions(pParent,pParent.attr("pid"));
			} else if(obj.length>0 && obj.is(":hidden")){
				obj.show("normal");
				cancleAllEditFunc(funcEdit);
			} else {
				cancleAllEditFunc(funcEdit);
				obj.hide("normal");
				addBt.show("normal");
			}
	    },150);
	});
}

function cancleAllEditFunc(funcEdits){
	$.each(funcEdits,function(i){
		$(funcEdits[i]).hide();
	});
}

function showAddProject(){
	$(".project_add").show();
}

function addProject(){
	var pNm = $("#newProject").val();
	if(!!!pNm){
		alert('项目名称不可以为空！');
		return;
	}
	
	var url = "/project/create/";
	var addProj = $.ajax({
		url : url,
		data: {projectName:pNm},
		type : "POST",
		async:false,
		dataType : "json"
	});
	
	addProj.done(function(data){
		if(data.code == 1){
			var project = data.data.projects[0];
			$(".project_list").append(projectTemplate.format({name:project.name,id:project.id}));
			$(".project_list").append(editProjectTemplate.format({
				value:project.name,
				pid:project.id
			}));
			$("#newProject").val('');
			
			addProjectEvent();
		}
	});
}

function cancelAddProj(){
	$(".project_add").hide();
}

function updateProject(obj,pid,pNm){
	var url = "/project/update";
	var updatePrj = $.ajax({
		url : url,
		data : {projectId:pid,projectName:pNm},
		type : "POST",
		async : false,
		dataType : "json"
	});
	
	updatePrj.done(function(data){
		if(data.code == 1){
			obj.parent().prev().children("p").html(pNm);
			obj.parent().hide();
			obj.parent().prev().show();
		}
	});
}

function deleteProject(obj){
	if(!confirm("确定删除!")){
		return;
	}
	
	var delProject = $.ajax({
		url : "/project/delete/"+obj.attr("pid"),
		type : "POST",
		async:false,
		dataType : "json"
	});
	
	delProject.done(function(data){
		if(data.code == 1){
			obj.parent().remove();
		}else{
			alert(data.msg);
		}
	});
}



var funcTemplate = [
                    '<div class="function_name" fid="@{fid}">',
                    	'<a class="function_delete" fid="@{fid}" onclick="deleteFunc($(this))">删除</a>',
                    	'<p>@{fname}</p>',
                    '</div>'
                    ].join('');
var editFuncTemplate = ['<div class="function_edit">',
							'<input type="text" class="function_name_edit" value="@{value}"/>',
							'<input type="button" fid=@{fid} class="function_update_bt" value="更新"/>',
							'<input type="button" class="function_cancle_update_bt" value="取消"/>',
						'</div>'
                           ].join('');
var addFuncTemplate = [
						'<div class="function_add">',
							'<input type="text" class="function_name_add" id="newFunction"/>',
							'<input type="button" class="function_add_bt" onclick="addFunction($(this))" value="添加"/>',
							'<input type="button" class="function_cancle_add_bt" value="取消"/>',
						'</div>'
                       ].join('');
//obj -> project_name
function loadFunctions(obj,pid){
	var url = "/func/query/"+pid;
	var func = $.ajax({
		url : url,
		type : "get",
		async:false,
		dataType : "json"
	});
	
	func.done(function(data){
		if(data.code == 1){
			var funcs = data.data.functions;
			var funcAdd = obj.children(".function_add");
			if(!funcAdd[0]) obj.append(addFuncTemplate);
			
			var funcList = [];
			$.each(funcs,function(i){
				funcList.push(funcTemplate.format({
												fname:funcs[i].name+'('+funcs[i].tcount+')'
												,fid:funcs[i].id}));
				funcList.push(editFuncTemplate.format({
								value:funcs[i].name,
								fid:funcs[i].id
							}));
				//obj.append(funcTemplate.format({fname:funcs[i].name+'('+funcs[i].tcount+')',fid:funcs[i].id}));
				//obj.append(editFuncTemplate.format({
				//	value:funcs[i].name,
				//	fid:funcs[i].id
				//}));
			});
			obj.append(funcList.join(''));
			addFuncEvent();
		}
	});
}

var fTimeFn = null;
function addFuncEvent(){
	$("div.function_name >p").dblclick(function(){
		 clearTimeout(fTimeFn);
		//编辑项目
		var p = $(this).parent();
		p.hide();
		p.next().show();
		
		$(".function_cancle_update_bt").click(function(){
			var p = $(this).parent();
			p.hide();
			p.prev().show();
		});
		
		$(".function_update_bt").click(function(){
			var t = $(this);
			var fid = t.attr("fid");
			var fNm = t.prev().val();
			updateFunction(t,fid,fNm);
		});
	});
	
	$("div.function_name >p").click(function(){
		var o = $(this);
		// 取消上次延时未执行的方法
	    clearTimeout(fTimeFn);
	    //执行延时
	    fTimeFn = setTimeout(function(){
	    	displayTestData(o);
	    	loadEnvi(o.parent().parent().attr("pid"));
	    },150);
	});
	
	$(".function_cancle_add_bt").click(function(){
		var p = $(this).parent();
		p.hide();
		p.parent().children(".function_add_link").show();
	});
}

function updateFunction(obj,fid,fNm){
	var url = "/func/update/"+fid+"/0/"+fNm;
	var updateFunc = $.ajax({
		url : url,
		type : "get",
		async:false,
		dataType : "json"
	});
	
	updateFunc.done(function(data){
		if(data.code == 1){
			obj.parent().prev().children("p").html(fNm);
			obj.parent().hide();
			obj.parent().prev().show();
		}
	});
}

function showAddFunction(obj,pid){
	obj.hide();
	
	var fNms = obj.parent().children(".function_name");
	if(fNms.length == 0){
		loadFunctions(obj.parent(),pid);
	}
	
	var fAdd = obj.parent().children(".function_add");
	if(fAdd.is(":hidden")){
		fAdd.show();
	}
}

function addFunction(obj){
	var parent = obj.parent();
	var pid = parent.parent().attr("pid");
	var fNm = parent.children("#newFunction").val();
	
	if(!fNm){
		alert('模块名称不可以为空！');
		return;
	}
	
	var url = "/func/create/"+pid+"/"+fNm;
	var addFunc = $.ajax({
		url : url,
		type : "get",
		async:false,
		dataType : "json"
	});
	
	addFunc.done(function(data){
		if(data.code == 1){
			var func = data.data.functions[0];
			parent.parent().append(funcTemplate.format({fname:func.name,fid:func.id}));
			parent.parent().append(editFuncTemplate.format({
				value:func.name,
				fid:func.id
			}));
			parent.children("#newFunction").val('');
			addFuncEvent();
		}
	});
}

function deleteFunc(obj){
	if(!confirm("确定删除!")){
		return;
	}
	
	var delFunc = $.ajax({
		url : "/func/delete/"+obj.parent().attr("fid"),
		type : "POST",
		async:false,
		dataType : "json"
	});
	
	delFunc.done(function(data){
		if(data.code == 1){
			obj.parent().remove();
			obj.parent().next().remove();
		}else{
			alert(data.msg);
		}
	});
}