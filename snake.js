/*
0-clear
1-apple
2-up
3-right
4-down
5-left
*/
window.addEventListener('keydown', function(event) 
{
    if(event.keyCode == 37 || event.keyCode == 65) 
    	ar1[headX][headY]=5;

    if(event.keyCode == 38 || event.keyCode == 87) 
    	ar1[headX][headY]=2;
    
    if(event.keyCode == 39 || event.keyCode == 68) 
    	ar1[headX][headY]=3;

    if(event.keyCode == 40 || event.keyCode == 83) 
    	ar1[headX][headY]=4;
});

var ar1, headX=0, headY=0, tailX=0, tailY=0;
var movement=[[-1, 0], [0, 1], [1, 0], [0, -1]];

reset();
mainLoop();

async function mainLoop()
{
	while(true)
	{
		drawarray(ar1);
		await snakerun();
	}
}

function snakerun()
{		
	var td=ar1[headX][headY];
	var tq=movement[td-2];

	headX+=tq[0];
	headY+=tq[1];

	if(headX<0 || headY<0 || headX>6 || headY>23||ar1[headX][headY]>1)
	{
		reset();
		
		return new Promise(resolve => {
	    	setTimeout(() => resolve(), 150);});
	}

	if(ar1[headX][headY]!=1)
	{
		console.log(tailX.toString()+" "+tailY.toString());
		var td1=ar1[tailX][tailY];
		var tq1=movement[td1-2];
		ar1[tailX][tailY]=0;
		tailX+=tq1[0];
		tailY+=tq1[1];
	}
	else
		newApple();

	ar1[headX][headY]=td;

	return new Promise(resolve => {
	    setTimeout(() => resolve(), 150);});
}

function newApple()
{
	var appleX=Math.floor(Math.random()*7), appleY=Math.floor(Math.random()*24);

	for(var i=appleX; (i%7)!=(appleX+6)%7; i++)
		for(var j=appleY; j%24!=(appleY+23)%24; j++)
			if(ar1[i][j]==0)
			{
				ar1[i][j]=1;
				return;
			}
}

function reset()
{
	ar1=Array.from({length:7}, e => Array(24).fill(0));	

	ar1[3][11]=2;
	ar1[1][11]=1;

	headX=3;
	headY=11;
	tailX=3;
	tailY=11;
}

function drawarray(arr)
{
	var str=
	"<div id=\"tableRenderElem\"><table><thead><tr><th colspan=\"2\"><div class=\"head-time\">Часові<br>проміжки</div></th>";

	for(var i=0; i<24; i++)
	{
		var str0=i.toString(), str1=(i+1).toString();

		if(i<10)
			str0="0"+str0;
		if(i<9)
			str1="0"+str1;

		str+=`<th scope="col"><div>${str0+"-"+str1}</div></th>`;
	}

	str+="</tr></thead><tbody>";

	var days=["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"];

	for(var i=0; i<7; i++)
	{
		str+=`<tr><td colspan="2"><div>${days[i]}</div></td>`;

		for(var j=0; j<24; j++)
		{
			var str1="";

			if(arr[i][j]==0)
				str1="cell-non-scheduled";
			else if(arr[i][j]==1)
				str1="cell-scheduled-maybe";
			else
				str1="cell-scheduled";

			str+=`<td class=${str1}></td>`;
		}

		str+="</tr>";
	}

	str+="</tbody></table></div>";
	document.getElementById("tableRenderElem").innerHTML=str;
}