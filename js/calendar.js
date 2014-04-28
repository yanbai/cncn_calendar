/*
example
MCalendar(2013,'March') wrong todo
*/
(function(window){	
	var getData = function(y,m,d,data){
		var _m = Number(m)<9 ? '0'+(Number(m)+1) : Number(m)+1,
			_d = Number(d)<10 ? '0'+d : d,
			key = String(y)+'-'+_m+'-'+_d;
		return data[key] ? data[key] : false;
	};
	
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
		//this.init();
	};
	
	MCalendar.prototype = {
		days : function(){return this.isLeapYear ? {0:31,1:29,2:31,3:30,4:31,5:30,6:31,7:31,8:30,9:31,10:30,11:31} : {0:31,1:28,2:31,3:30,4:31,5:30,6:31,7:31,8:30,9:31,10:30,11:31}},
		init:function(){
			//this.mm = this.m[this.month];
			var firstDay = new Date(this.year,this.month,1);
			var b = {0:6,1:0,2:1,3:2,4:3,5:4,6:5};
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
	};
	
	
	
	//newMCalendar继承MCalendar
	var newMCalendar = function(year,month,day,data){
		MCalendar.call(this,year,month);
		if(typeof(arguments[2]) == 'number'){
			this.day = day;
			this.data = data;
		}else if(typeof(arguments[2]) == 'object'){
			this.day = '';
			this.data = day;
		}
		this.init();
	};
	newMCalendar.prototype = new MCalendar;
	newMCalendar.prototype.constructor = newMCalendar;
	newMCalendar.prototype.init = function(){
		var firstDay = this.day ? new Date(this.year,this.month,this.day) : new Date(this.year,this.month,1);
		var b = {0:6,1:0,2:1,3:2,4:3,5:4,6:5};
		var b = b[firstDay.getDay()];

		var s = '';
		for(var i = 0,l=b;i<l;i++){
			s+='<b></b>';
		};
		
		for(var i = firstDay.getDate(),l=this.days()[this.month];i<=l;i++){ //not efficient
			var valuable = getData(this.year,this.month,i,this.data);
			var m = this.month>8?Number(this.month)+1:'0'+(Number(this.month)+1);
			var d = i>9?i:'0'+i;
			this.str += '<a class="' + (this.today.getFullYear() == this.year &&  this.today.getMonth() == this.month && this.today.getDate() == i ? 'cur' : '') + (valuable?' valuable':'') + (valuable?'':' un') +'" href="javascript:;" data_price_d="'+(valuable?valuable['price_d']:'')+'" data_price_child_d="'+(valuable?valuable['price_child_d']:'')+'" data_date="'+this.year+'-'+m+'-'+d+'">'+'<em class="date">'+i+'</em>'+(valuable?'<em class="price">￥'+valuable['price_d']+'</em>':'')+'</a>'
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
	};
	
	var Calendar = {
		today : new Date(),
		year : new Date().getFullYear(),
		month : new Date().getMonth(),
		
		init:function(ele,data){
			var t = this;
			this.data = data;
			this.input = document.getElementById(ele);
			t.showDateBoard();
			
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
			var range = [];
			//获取数据提供的第一条和最后一条月份，以及第一条和最后一条年份
			var day_data = Object.keys(this.data),
				first_m = parseInt(day_data[0].split('-')[1],10)-1,
				last_m = parseInt(day_data[day_data.length-1].split('-')[1],10)-1,
				first_y = parseInt(day_data[0].split('-')[0],10),
				last_y = parseInt(day_data[day_data.length-1].split('-')[0],10);
			//处理跨年情况
			if(last_y>first_y){
				for(var i=first_m,l=11;i<=l;i++)range.push(String(first_y)+'-'+String(i));
				for(var i=0,l=last_m;i<=l;i++)range.push(String(last_y)+'-'+String(i));
			}else{
			//不跨年
				for(var i=first_m,l=last_m;i<=l;i++){
					range.push(String(first_y)+'-'+String(i));
				}
			}
			//获取数据提供的第一天之前最近的一个周一 或者当月第一天，以便第一个月显示
			var f_day_of_data = parseInt(day_data[0].split('-')[2],10),
				f_day = new Date(first_y,first_m,f_day_of_data);
				show_first_day = f_day.getDay()>0 ? (f_day_of_data-(f_day.getDay()-1)>0?f_day_of_data-(f_day.getDay()-1):1) : (f_day_of_data-6>0?f_day_of_data-6:1);
				
			for(var i=0,l=range.length;i<l;i++){
				if(i == 0){
					var thisMonth = new newMCalendar(range[i].split('-')[0],range[i].split('-')[1],show_first_day,this.data);
				}else{
					var thisMonth = new newMCalendar(range[i].split('-')[0],range[i].split('-')[1],this.data);
				};
				var dateDiv = document.createElement('div');
				this.dateDiv = dateDiv;
				dateDiv.className = 'date_select';
				dateDiv.id = 'date_select_30';
				dateDiv.innerHTML = '<div class="date_select_yymm">\
								<span>'+this.year+'年 '+(Number(range[i].split('-')[1])+1)+'月</span>\
							</div>'+thisMonth.str
				this.input.appendChild(dateDiv);
			};
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
			
			var newMonth = new newMCalendar(this.year,this.month,this.data);
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
})(window);