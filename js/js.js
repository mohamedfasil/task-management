var taskcounter=listcountr=0,lists,main=document.getElementById('main-content');
//task prototype
var Task=function(subject, description){
	var _defaultstatus='All Tasks';
	var _task={
		number:taskcounter++,
		subject:subject,
		description:description,
		time:new Date(),
		status:status,
	};
	//render task on browser
	(function(task){
		var _thtml='';
		_thtml+='<article draggable="true" ondragstart="move.drag(event,'+task.number+')" class="task-section sub-section" id="task-'+task.number+'" data-task="'+task.number+'"><h4>'+task.subject+'</h4><p>'+task.description+'</p><div class="overflow"><small class="pull-left label"><i class="glyphicon glyphicon-time"></i> '+formatDate(task.time)+'</small><a href="javascript:void(0);" data-task="'+task.number+'" class="remove-task pull-right btn btn-danger btn-xs"><i class="glyphicon glyphicon-remove"></i></a><a href="javascript:void(0);" data-task="'+task.number+'" class="update-task pull-right btn btn-info btn-xs"><i class="glyphicon glyphicon-pencil"></i></a></div>';
		_thtml+='</article>';
		$('#list-0 .panel-body').prepend(_thtml);
	})(_task);
	var renderHTML=function(task){
		var $article=$("#task-"+task.number);
		var _thtml='<h4>'+task.subject+'</h4><p>'+task.description+'</p><div class="overflow"><small class="pull-left label"><i class="glyphicon glyphicon-time"></i> '+formatDate(task.time)+'</small><a href="javascript:void(0);" data-task="'+task.number+'" class="remove-task pull-right btn btn-danger btn-xs"><i class="glyphicon glyphicon-remove"></i></a><a href="javascript:void(0);" data-task="'+task.number+'" class="update-task pull-right btn btn-info btn-xs"><i class="glyphicon glyphicon-pencil"></i></a></div>';
		$article.html(_thtml);
		$article.attr('draggable',true);
	}
	var updateStatus=function(status,positionindex){
		this.status=status;
		var $thishtml=$("#task-"+this.number);
		if(typeof positionindex!=="undefined"){
			$thishtml.insertBefore(positionindex);
		}else{
			$(".lists[data-name='"+status+"'] .panel-body").prepend($thishtml);	
		}
		
	}
	var updateTask=function(subject,description){
		this.subject=subject;
		this.description=description;
		renderHTML(this);
		
	}
	var renderupdateTaskForm=function(subject,description){
		var $article=$("#task-"+this.number);
		$article.attr('draggable',false);
		var _formhtml='<form class="update-task-form" id="update-task-form-'+this.number+'" data-task="'+this.number+'"><div><input type="text" name="subject" class="form-control input-sm" id="subject-'+this.number+'" value="'+this.subject+'" placeholder="Task Name"/><textarea name="description" id="description-'+this.number+'" rows="3" class="form-control input-sm" value="'+this.description+'" placeholder="Task Description"></textarea><button type="submit" class="btn btn-success btn-sm">Save</button><button type="button" class="btn btn-default cancel-form btn-sm" data-task="'+this.number+'">Cancel</button></div></form>';
		$article.html(_formhtml);
	}
	var cancelForm=function(){
		renderHTML(this);
	}
	_task.updateStatus=updateStatus;
	_task.renderupdateTaskForm=renderupdateTaskForm;
	_task.updateTask=updateTask;
	_task.cancelForm=cancelForm;
	return _task;
};
//list prototype
var List=function(name){
	(function(){
		var _thtml='';
		_thtml+='<article ondrop="move.drop(event,'+listcountr+')" ondragover="move.allowDrop(event)" class="col-md-3 lists" id="list-'+listcountr+'" data-name="'+name+'"><section class="panel ';
		switch(listcountr){
			case 0:
				_thtml+='panel-primary';
				break;
			case 1:
				_thtml+='panel-danger';
				break;
			case 2:
				_thtml+='panel-warning';
				break;
			case 3:
				_thtml+='panel-success';
		}
		_thtml+='"><header class="panel-heading"><h2>'+name+'</h2></header><section class="panel-body"><article class="task-section sub-section placeholder-section" id="placeholder-'+listcountr+'"></article>';
		if(listcountr++===0){
			_thtml+='<article class="sub-section"><header><h4>New Task</h4></header><form id="new-task-form"><div><input type="text" name="subject" class="form-control input-sm" id="subject" placeholder="Task Name"/><textarea name="description" id="description" rows="3" class="form-control input-sm" placeholder="Task Description"></textarea><button type="submit" class="btn btn-primary btn-sm">Add Task</button></div></form></article>';
		}
		_thtml+='</section></section></article>';
		main.insertAdjacentHTML('beforeend',_thtml);
	})();

	return {
		name:name,
		tasks:{}
	}
};

//date helper function
function formatDate(datetime){
	var monthNames = [
        "Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct","Nov", "Dec"
    ];
    var month=monthNames[datetime.getMonth()];
    return month+' '+datetime.getDate()+', '+datetime.getFullYear();

}

// task list events
$("#main-content").on('click','.remove-task',function(e){
	e.preventDefault();
	var r=confirm('Do you really want to delete this task?'),task=$(this).attr('data-task');
	tasks[task]=null;
	if(r){
		$("#task-"+task).remove();
	}
});
$("#main-content").on('click','.cancel-form',function(e){
	e.preventDefault();
	var task=tasks[$(this).attr('data-task')];
	task.cancelForm();
});
$("#main-content").on('click','.update-task',function(e){
	e.preventDefault();
	var task=tasks[$(this).attr('data-task')];
	task.renderupdateTaskForm();
});

$("#main-content").on('click','.update-task',function(e){
	e.preventDefault();
	var task=tasks[$(this).attr('data-task')];
	task.renderupdateTaskForm();
});

$("#main-content").on('submit','.update-task-form',function(e){
	e.preventDefault();
	task=tasks[$(this).attr('data-task')];
	var name=$("#subject-"+task.number).val();
	if(name!=""){
		var description=$("#description-"+task.number).val();
		task.updateTask(name,description);
	}else{
		alert('Please enter a task name');
		return false;
	}
});


//Drag'n Drop functions
var crntlistblock,listblock;
var move={
	drag:function(e,task){
		e.dataTransfer.setData('text',e.target.id);
		e.dataTransfer.setData('task-id',$(e.target).attr('data-task'));
	},
	drop:function(e,list){
		e.preventDefault();
		if(e.target.className.indexOf("task-section")>-1){
			var data=e.dataTransfer.getData('text');
			var tTask=tasks[e.dataTransfer.getData('task-id')];
			var listname=$("#list-"+list).attr('data-name');
			tTask.updateStatus(listname,e.target);
		}
	},
	allowDrop:function(e){
		e.preventDefault();
	},
	handleDragStart:function(e){
		e.target.style.opacity='0.5';
		listblock=e.target.offsetParent.id;
	},
	handleDragEnd:function( e ) {
      	e.target.style.opacity = "";
      	$(".over").removeClass('over');
  	},
  	handleDragEnter:function(e){
  		crntlistblock=e.target.offsetParent.id.toString();
  		if(e.target.className.indexOf("task-section")>-1){
  			e.target.classList.add('over');
  		}
  		if(e.target.offsetParent.id!==listblock){
  			if(e.target.className.indexOf("lists")>-1){
	  			e.target.classList.add('over');
	  		}	
  		}
  	},
  	handleDragLeave:function(e){
  		if(e.target.offsetParent.id.toString()===crntlistblock){
  			e.target.classList.remove('over');
  		}
  		if(e.target.className.indexOf("task-section")>-1){
  			e.target.classList.remove('over');
  		}
  		if(e.target.offsetParent.className.indexOf("lists")>-1){
  			e.target.classList.remove('over');
  		}
  	}
}
document.addEventListener("dragstart",move.handleDragStart,false);
document.addEventListener("dragend", move.handleDragEnd, false);
document.addEventListener("dragenter", move.handleDragEnter, false);
document.addEventListener("dragleave", move.handleDragLeave, false);


//if((typeof localStorage!=="undefined") && typeof localStorage.lists==="undefined"){
	lists=[new List('All Tasks'),new List('To-do'),new List('On Progress'),new List('Completed')];
//	localStorage.lists=JSON.stringify(lists);
//}else{
//	lists=JSON.parse(localStorage.lists);
//}
var task1=new Task('Task 1','Task Description');
var task2=new Task('Task 2','Task Description');
var task3=new Task('Task 3','Task Description');
var task4=new Task('Task 4','Task Description');
var task5=new Task('Task 5','Task Description');
task2.updateStatus('To-do');
task3.updateStatus('Completed');
task5.updateStatus('On Progress');
var tasks=[
	task1,task2,task3,task4,task5
];

//New task form
document.getElementById('new-task-form').onsubmit=function(){ return addTask();}
function addTask(){
	var subject=document.getElementById('subject').value;
	if(subject===""){
		alert('Please enter a task name');
		return false;
	}
	var description=document.getElementById('description').value;
	document.getElementById('subject').value='';
	document.getElementById('description').value='';
	var tTask=new Task(subject,description);
	tasks.push(tTask);
	return false;
}

/****
[
{
	number:0,
	subject:'Task 1',
	description:'Task Description',
	time:dateObj,
	status:'',
	updateStatus:function(){},
	renderupdateTaskForm:function(){},
	updateTask:function(){},
	cancelForm:function(){}
},
{
	number:1,
	subject:'Task 2',
	description:'Task Description',
	time:dateObj,
	status:'',
	updateStatus:function(){},
	renderupdateTaskForm:function(){},
	updateTask:function(){},
	cancelForm:function(){}
}
]
