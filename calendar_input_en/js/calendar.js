/*
example
new Calendar({
	eleId:"j-to-time",
	minDate:-1,
	maxDate:3
})
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
	
	var MCalendar = function(year,month,option){
		this.year = year;
		this.month = month;
		this.today = new Date();
		var minDate = option.minDate,
			maxDate = option.maxDate;
		this.str='';

		this.isLeapYear = this.year%4==0 && this.year%100!=0 || this.year%4==0 && this.year%400==0;

		if(typeof minDate == "number"){
			this.minDate = new Date(this.today.getFullYear(),this.today.getMonth(),this.today.getDate()+minDate)
		}
		if(typeof maxDate == "number"){
			this.maxDate = new Date(this.today.getFullYear(),this.today.getMonth(),this.today.getDate()+maxDate)
		}
		
		this.init();
	};
	
	MCalendar.prototype = {
		days : function(){return this.isLeapYear ? {0:31,1:29,2:31,3:30,4:31,5:30,6:31,7:31,8:30,9:31,10:30,11:31} : {0:31,1:28,2:31,3:30,4:31,5:30,6:31,7:31,8:30,9:31,10:30,11:31}},
		init:function(){

			var firstDay = new Date(this.year,this.month,1);
			var b = {0:6,1:0,2:1,3:2,4:3,5:4,6:5}
			var blankBeforeFirstDay = b[firstDay.getDay()];
	
			var s = '';
			for(var i = 0,l=blankBeforeFirstDay;i<l;i++){
				s+='<b></b>';
			};

			for(var i = 1,l=this.days()[this.month];i<=l;i++){
				var unavailable = new Date(this.year,this.month,i)>this.maxDate || new Date(this.year,this.month,i)<this.minDate;
				if(unavailable){
					this.str += '<a class="' + (this.today.getFullYear() === this.year &&  this.today.getMonth() === this.month && this.today.getDate() === i ? 'cur today' : '') + 'un' +'" href="javascript:;">'+i+'</a>'
				}else{
					this.str += '<a class="' + (this.today.getFullYear() === this.year &&  this.today.getMonth() === this.month && this.today.getDate() === i ? 'cur today' : '') + 'available' +'" href="javascript:;" data-date="'+this.year+','+this.month+','+i+'">'+i+'</a>'
				}
			};
			this.str = '<div class="date_select_dd fn-clear">\
				<span>\
					Mo\
					<i></i>\
				</span>\
				<span>\
					Tu\
					<i></i>\
				</span>\
				<span>\
					We\
					<i></i>\
				</span>\
				<span>\
					Th\
					<i></i>\
				</span>\
				<span>\
					Fr\
					<i></i>\
				</span>\
				<span>\
					Sa\
					<i></i>\
				</span>\
				<span>\
					Su\
					<i></i>\
				</span>'+s+this.str+
			'</div>';
		}
	}
	
	
	var Calendar = function(option){
		this.today = new Date();
		this.year = new Date().getFullYear();
		this.month = new Date().getMonth();

		this.monthMap = {
			0:{"full":"January","short":"Jan"},
			1:{"full":"February","short":"Feb"},
			2:{"full":"March","short":"Mar"},
			3:{"full":"April","short":"Apr"},
			4:{"full":"May","short":"May"},
			5:{"full":"June","short":"Jun"},
			6:{"full":"July","short":"Jul"},
			7:{"full":"August","short":"Aug"},
			8:{"full":"September","short":"Sep"},
			9:{"full":"October","short":"Oct"},
			10:{"full":"November","short":"Nov"},
			11:{"full":"December","short":"Dec"}
		};
		this.init(option);
	}

	Calendar.prototype = {
		init:function(option){
			var t = this;
			if(!option.eleId){console.log("element id missed")};
			this.option = option;
			this.eleId = option.eleId;
			this.minDate = option.minDate;
			this.maxDate = option.maxDate;
			
			this.input = document.getElementById(this.eleId);
			this.input.onfocus = function(){if(t.dateDiv){t.delDateBoard();}t.showDateBoard()}
		},

		initBind : function(){
			var t = this;
			EventUtil.addHandler(document,'click',function(event){
				var event = EventUtil.getEvent(event),
					target = EventUtil.getTarget(event);
				if(t.dateDiv){
					var pn = target;
					while(pn.tagName.toLowerCase()!='html'){
						if(pn==t.dateDiv){return}
						else{pn = pn.parentNode}
					}
					if(target !== t.input)t.delDateBoard()
				}
			})
		
			EventUtil.addHandler(t.dateDiv,'click',function(event){
				var event = EventUtil.getEvent(event),
					target = EventUtil.getTarget(event);
				if(target.className == 'prev' || target.className == 'next'){
					t.change(target.className);
					if (event.stopPropagation) {
						event.stopPropagation();
					} else {
						event.cancelBubble = true;
					}
				}else if(target.className == 'available'){
					var date = target.getAttribute("data-date").split(",");
					t.getDate(date[0],date[1],date[2]);
					if (event.stopPropagation) {
						event.stopPropagation();
					} else {
						event.cancelBubble = true;
					}
				}
			})
		},
		
		setDateDivPosition:function(){
			var X= this.input.getBoundingClientRect().left+document.documentElement.scrollLeft;
			var Y= this.input.getBoundingClientRect().top+document.documentElement.scrollTop;
			var dateDivLeft = X,
				dateDivTop = Y + this.input.offsetHeight;
				
			this.dateDiv.style.position = "absolute";
			this.dateDiv.style.left = dateDivLeft+"px";
			this.dateDiv.style.top = dateDivTop+"px";
		},

		showDateBoard:function(){
			var thisMonth = new MCalendar(this.year,this.month,this.option);
			var dateDiv = document.createElement('div');
			this.dateDiv = dateDiv;
			dateDiv.className = 'date_select';
			dateDiv.id = 'date_select_30';
			dateDiv.innerHTML = '<div class="date_select_yymm">\
							<i class="prev"></i>\
							<i class="next"></i>\
							<span>'+this.monthMap[this.month]["full"]+' '+this.year+'</span>\
						</div><a class="date_select_back_today" href="javascript:;">today</a>'+thisMonth.str

			this.setDateDivPosition();
			document.body.appendChild(dateDiv);
			this.initBind();
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
			
			var newMonth = new MCalendar(this.year,this.month,this.option);
			this.dateDiv.innerHTML = '\
				<div class="date_select_yymm">\
					<i class="prev"></i>\
					<i class="next"></i>\
					<span>'+this.monthMap[this.month]["full"]+' '+this.year+'</span>\
				</div><a class="date_select_back_today" href="javascript:;">today</a>'+newMonth.str;
		},
		
		dateType:{type_1:['年-月-日','-'],type_2:['XX年XX月XX日','']},

		getDate : function(y,m,d){
			this.input.value = y+'-'+(m*1+1)+'-'+d;
			this.delDateBoard();
		}
	}
	
	window.Calendar = Calendar;
})(window)