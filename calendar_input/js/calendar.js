/*
example
MCalendar(2013,'March') wrong todo
*/
(function(window){
	var EventUtil={
		addHandler:function(ele,type,handler){
			if(ele.addEventListener){
				ele.addEventListener(type,handler,false);
			}else if (ele.attachEvent){
				ele.attachEvent('on'+type,handler);
			}else{
				ele['on'+type]=handler;
			}
		},
		getEvent:function(event){
			return event ? event : window.event;
		},
		getTarget:function(event){
			return event.target || event.srcElement;
		},
		removeHandler:function(ele,type,handler){
			if(ele.removeEventListener){
				ele.removeEventListener(type,handler,false);
			}else if(ele.detachEvent){
				ele.detachEvent('on'+type,handler);
			}else{
				ele['on'+type]=null;
			}
		}
	};
	
	var MCalendar = function(year,month){
		this.year = year;
		this.month = month;
		//this.mm = 0;
		this.today = new Date();
		this.str='';
		//this.m = {'January':1,'February':2,'March':3,'April':4,'May':5,'June':6,'July':7,'August':8,'September':9,'October':10,'November':11,'December':12};
		this.isLeapYear = this.year%4==0 && this.year%100!=0 || this.year%4==0 && this.year%400==0;
		this.init();
	};
	
	MCalendar.prototype = {
		days : function(){return this.isLeapYear ? {0:31,1:29,2:31,3:30,4:31,5:30,6:31,7:30,8:31,9:30,10:31,11:30} : {0:31,1:28,2:31,3:30,4:31,5:30,6:31,7:30,8:31,9:30,10:31,11:30}},
		init:function(){
			//this.mm = this.m[this.month];
			var firstDay = new Date(this.year,this.month,1);
			var b = {0:6,1:0,2:1,3:2,4:3,5:4,6:5}
			var b = b[firstDay.getDay()];
	
			var s = '';
			for(var i = 0,l=b;i<l;i++){
				s+='<b></b>';
			};
			//var a = document.createElement('a');
			for(var i = 1,l=this.days()[this.month];i<=l;i++){ //not efficient
				this.str += '<a class="' + (this.today.getFullYear() === this.year &&  this.today.getMonth() === this.month && this.today.getDate() === i ? 'cur today' : '')  +'" href="javascript:;" onclick=Calendar.getDate("'+this.year+'","'+this.month+'","'+i+'")>'+i+'</a>'
			};
			this.str = '<div class="date_select_dd fn-clear">\
				<span>\
					一\
					<i></i>\
				</span>\
				<span>\
					二\
					<i></i>\
				</span>\
				<span>\
					三\
					<i></i>\
				</span>\
				<span>\
					四\
					<i></i>\
				</span>\
				<span>\
					五\
					<i></i>\
				</span>\
				<span>\
					六\
					<i></i>\
				</span>\
				<span>\
					日\
					<i></i>\
				</span>'+s+this.str+
			'</div>';
		}
	}
	
	
	var Calendar = {
		today : new Date(),
		year : new Date().getFullYear(),
		month : new Date().getMonth(),
		//m : {1:'January',2:'February',3:'March',4:'April',5:'May',6:'June',7:'July',8:'August',9:'September',10:'October',11:'November',12:'December'},
		
		init:function(ele){
			var t = this;
			this.input = document.getElementById(ele);
			this.input.onfocus = function(){if(t.dateDiv){t.delDateBoard();}t.showDateBoard()}
			EventUtil.addHandler(document,'click',function(event){
				var event = EventUtil.getEvent(event),
					target = EventUtil.getTarget(event);
				//关闭日期面板
				if(t.dateDiv){
					var pn = target.parentNode;
					while(pn.tagName.toLowerCase()!='html'){
						if(pn==t.dateDiv){return}
						else{pn = pn.parentNode}
					}
					if(target !== t.input)t.delDateBoard()
				}
			})
			
			EventUtil.addHandler(document,'click',function(event){
				var event = EventUtil.getEvent(event),
					target = EventUtil.getTarget(event);
				//切换日期面板
				if(target.className == 'prev' || target.className == 'next'){
					t.change(target.className);
					if (event.stopPropagation) {
						event.stopPropagation();
					} else {
						event.cancelBubble = true;
					}
				}
			})
		},
		
		showDateBoard:function(){
			//月份还原
			this.year = new Date().getFullYear();
			this.month = new Date().getMonth();
			//月份还原
			
			var thisMonth = new MCalendar(this.year,this.month);
			var dateDiv = document.createElement('div');
			this.dateDiv = dateDiv;
			dateDiv.className = 'date_select';
			dateDiv.id = 'date_select_30';
			dateDiv.innerHTML = '<div class="date_select_yymm">\
							<i class="prev"></i>\
							<i class="next"></i>\
							<span>'+this.year+'年 '+(this.month+1)+'月</span>\
						</div><a class="date_select_back_today" href="javascript:;">回到今天</a>'+thisMonth.str
			document.body.appendChild(dateDiv);
		},
		
		delDateBoard:function(){
			this.dateDiv.parentNode.removeChild(this.dateDiv);
			this.dateDiv = null;
		},
		
		change : function(direction){
			if(direction == 'next'){
				this.year = this.month == 11 ? this.year+1 : this.year
				this.month = this.month == 11 ? 0 : this.month+1
			}else if(direction == 'prev'){
				this.year = this.month == 0 ? this.year-1 : this.year
				this.month = this.month == 0 ? 11 : this.month-1
			}
			
			var newMonth = new MCalendar(this.year,this.month);
			this.dateDiv.innerHTML = '\
				<div class="date_select_yymm">\
					<i class="prev"></i>\
					<i class="next"></i>\
					<span>'+this.year+'年 '+(this.month+1)+'月</span>\
				</div><a class="date_select_back_today" href="javascript:;">回到今天</a>'+newMonth.str;
		},
		
		dateType:{type_1:['年-月-日','-'],type_2:['XX年XX月XX日','']},
		
		getDate:function(y,m,d){
			this.input.value = y+'-'+(m*1+1)+'-'+d;
			this.delDateBoard();
		}
	}
	
	window.Calendar = Calendar;
})(window)