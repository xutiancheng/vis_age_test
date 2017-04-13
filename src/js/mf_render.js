/*
Color rendering functions
*/

var reviewpoints=0;
function render() {

  // if(reviewpoints) {
  //   drawpnts={'xoff':0,'yoff':0,'pnts':[]};
  // }
//console.log(featurecoords,'56456');
//get eyes angle
  var reye_center={'x':0,'y':0};
  var leye_center={'x':0,'y':0};

  for(var i=0,l=featurecoords['reye'].length;i<l;i++) {

    reye_center.x+=featurecoords['reye'][i].x;
    reye_center.y+=featurecoords['reye'][i].y;
  }

  for(var i=0,l=featurecoords['leye'].length;i<l;i++) {
    leye_center.x+=featurecoords['leye'][i].x;
    leye_center.y+=featurecoords['leye'][i].y;
  }

  reye_center.x=reye_center.x/featurecoords['reye'].length;
  reye_center.y=reye_center.y/featurecoords['reye'].length;

  leye_center.x=leye_center.x/featurecoords['leye'].length;
  leye_center.y=leye_center.y/featurecoords['leye'].length;

  var faceangle=Math.atan2((reye_center.y-leye_center.y),(reye_center.x-leye_center.x));

  //console.log(currentmakeover);

  for(var type in currentmakeover) {
    if(currentmakeover[type]['apply']==0) {
      continue;
    }
    //console.log(type);
    var r=currentmakeover[type]['r'];
    var g=currentmakeover[type]['g'];
    var b=currentmakeover[type]['b'];
    var op=currentmakeover[type]['op'];

    switch(type) {
      case 'eyeshadow':
        //eyeshadow_draw('reye',r,g,b,op );
        //eyeshadow_draw('leye',r,g,b,op );
        //console.log(1)
        break;
      case 'eyeshadow_0':
        //eyeshadow_draw('reye',r,g,b,op,0 );
        //eyeshadow_draw('leye',r,g,b,op,0 );
        //console.log(11)
        break;
      case 'eyeshadow_1':
        //eyeshadow_draw('reye',r,g,b,op,1 );
        //eyeshadow_draw('leye',r,g,b,op,1 );
        //console.log(111)
        break;
      case 'eyeshadow_2':
        eyeshadow_draw('reye',r,g,b,op,2 );
        eyeshadow_draw('leye',r,g,b,op,2 );
        //console.log(1111)
        break;
      case 'eyeliner':
        eyeliner_draw('reye',r,g,b,op );
        eyeliner_draw('leye',r,g,b,op );
        break;
      case 'lipcolor':
        lips_draw( featurecoords['outerlip'], featurecoords['innerlip'], r,g,b,op );
        break;
      case 'lash':
        var mylashimg=currentmakeover[type]['lashimg'];
        var isBottom=currentmakeover[type]['isBottom'];
        //console.log(999)
        eyelash_draw('reye',mylashimg,op,faceangle,isBottom);
        eyelash_draw('leye',mylashimg,op,faceangle,isBottom);
        break;
      default:
        break;
    }
  }

  // if(reviewpoints) {
  //   drawpoints();
  // }
}

function toGreyScale(canvasid,resultid) {
  var mycanvas = document.getElementById(canvasid);
  var myctx = mycanvas.getContext('2d');

  var mywidth=mycanvas.width;
  var myheight=mycanvas.height;

  var imageData = myctx.getImageData(0, 0, mywidth, myheight);
  var data = imageData.data;

  for(var i = 0; i < data.length; i += 4) {
    //var avg = Math.round((data[i] + data[i + 1] + data[i + 2])/3);
    // red
    data[i] = data[i+3];
    // green
    data[i + 1] = data[i+3];
    // blue
    data[i + 2] = data[i+3];

    data[i+3]=255;
  }

  return imageData;
/*
  var resultcanvas = document.getElementById(resultid);
  resultcanvas.width=mywidth;
  resultcanvas.height=myheight;
  var resultctx = resultcanvas.getContext('2d');

  // overwrite original image
  resultctx.putImageData(imageData, 0, 0);
*/
}

function copyAlpha(alphaData,resultid,r,g,b,keeprgb) {
  var mycanvas = document.getElementById(resultid);
  var myctx = mycanvas.getContext('2d');

  var mywidth=mycanvas.width;
  var myheight=mycanvas.height;

  var alphadata=alphaData.data;

  var imageData = myctx.getImageData(0, 0, mywidth, myheight);
  var data = imageData.data;

  for(var i = 0; i < data.length; i += 4) {
    if(typeof keeprgb=="undefined" || keeprgb==0) {
      data[i]=r;
      data[i+1]=g;
      data[i+2]=b;
    }
    data[i+3]=alphadata[i];
  }

  // overwrite original image
  myctx.putImageData(imageData, 0, 0);
}


function eyeshadow_draw(type,r,g,b,oop,placement) {
  if(typeof placement=="undefined") {
    placement="";
  }

  if(type=='reye') {
    var browtype='rbrow';
    var drawfunc=window['right_shadow_draw'+placement];
    //console.log(drawfunc);
  } else if(type=='leye') {
    var browtype='lbrow';
    var drawfunc=window['left_shadow_draw'+placement];
  } else {
    console.log('Error: Unsupported type '+type);
    return;
  }

//adjust opacity based on RGB
  var v=(r+g+b)/765.0;  //0-1 gray value
  var a=2.5;   //color based multiplier
  var op_mult=Math.pow(a,1-2*v);    //product opacity multiplier
  var op=oop*op_mult;

  var browy=Math.round((featurecoords[browtype][0].y + featurecoords[browtype][1].y + featurecoords[browtype][2].y) / 3);

  if(featurecoords[type].length==0) {
    console.log('Error: '+type+' length is 0');
    return;
  }

  var minx=-1,maxx=-1;
  var miny=-1,maxy=-1;
  for(var i=0,l=featurecoords[type].length;i<l;i++) {
    if(minx==-1) {
      minx=featurecoords[type][i].x;
    } else {
      if(minx>featurecoords[type][i].x) {
        minx=featurecoords[type][i].x;
      }
    }

    if(maxx==-1) {
      maxx=featurecoords[type][i].x;
    } else {
      if(maxx<featurecoords[type][i].x) {
        maxx=featurecoords[type][i].x;
      }
    }


    if(miny==-1) {
      miny=featurecoords[type][i].y;
    } else {
      if(miny>featurecoords[type][i].y) {
        miny=featurecoords[type][i].y;
      }
    }

    if(maxy==-1) {
      maxy=featurecoords[type][i].y;
    } else {
      if(maxy<featurecoords[type][i].y) {
        maxy=featurecoords[type][i].y;
      }
    }
  }

  if(miny>maxy) {
    console.log('Error: something wrong with '+type+' coords');
    return;
  }

  miny=Math.min(miny,browy);

  var drawbox=[minx,miny,maxx,maxy];

  var draww=drawbox[2]-drawbox[0];
  var drawh=drawbox[3]-drawbox[1];

  drawbox[0]=Math.round(drawbox[0]-draww*0.4);
  drawbox[2]=Math.round(drawbox[2]+draww*0.4);

  draww=drawbox[2]-drawbox[0];

  var blurradius=Math.max(1,Math.round(draww*0.03));

  var bluroff=blurradius*2;
  var newx0=Math.max(0,drawbox[0]-bluroff);
  var newy0=Math.max(0,drawbox[1]-bluroff);
  var newx1=Math.min(canvas.width-1,drawbox[2]+bluroff);
  var newy1=Math.min(canvas.height-1,drawbox[3]+bluroff);

  var blurw=newx1-newx0;
  var blurh=newy1-newy0;


  canvas_draw.width=blurw;
  canvas_draw.height=blurh;

  //canvas_draw.style.backgroundColor="rgba("+r+","+g+","+b+",1)";

  context_draw.clearRect(0, 0, blurw, blurh);


  drawfunc( 'canvas_draw',
            featurecoords[type][0].x-newx0,featurecoords[type][0].y-newy0,
            featurecoords[type][2].x-newx0,featurecoords[type][2].y-newy0,
            featurecoords[type][4].x-newx0,featurecoords[type][4].y-newy0,
            featurecoords[type][6].x-newx0,featurecoords[type][6].y-newy0,
            browy-newy0,
            r,g,b,op );

  var myImageData=toGreyScale('canvas_draw','canvas_grey');
  myImageData=boxBlurDataRGB(myImageData, 0, 0, blurw, blurh, blurradius, 1);


  var greycanvas = document.getElementById('canvas_grey');
  greycanvas.width=canvas_draw.width;
  greycanvas.height=canvas_draw.height;
  var greyctx = greycanvas.getContext('2d');

  // overwrite original image
  greyctx.putImageData(myImageData, 0, 0);


  copyAlpha(myImageData,'canvas_draw',r,g,b);

//  boxBlurCanvasRGBA('canvas_draw', 0, 0, blurw, blurh, blurradius, 1);
//  stackBlurCanvasRGBA('canvas_draw', 0, 0, blurw, blurh, blurradius);
//  integralBlurCanvasRGBA( 'canvas_draw', 0, 0, blurw, blurh, blurradius, 1);
//  stackBoxBlurCanvasRGBA('canvas_draw', 0, 0, blurw, blurh, blurradius,1);

  context.drawImage(canvas_draw,newx0,newy0);
}






function eyeliner_draw(type,or,og,ob,op) {
  var r=Math.round(or/2);
  var g=Math.round(og/2);
  var b=Math.round(ob/2);

  if(type=='reye') {
    var browtype='rbrow';
    var drawfunc=right_exactliner_draw;
  } else if(type=='leye') {
    var browtype='lbrow';
    var drawfunc=left_exactliner_draw;
  } else {
    console.log('Error: Unsupported type '+type);
    return;
  }

  var browy=Math.round((featurecoords[browtype][0].y + featurecoords[browtype][1].y + featurecoords[browtype][2].y) / 3);

  if(featurecoords[type].length==0) {
    console.log('Error: '+type+' length is 0');
    return;
  }

  var minx=-1,maxx=-1;
  var miny=-1,maxy=-1;
  for(var i=0,l=featurecoords[type].length;i<l;i++) {
    if(minx==-1) {
      minx=featurecoords[type][i].x;
    } else {
      if(minx>featurecoords[type][i].x) {
        minx=featurecoords[type][i].x;
      }
    }

    if(maxx==-1) {
      maxx=featurecoords[type][i].x;
    } else {
      if(maxx<featurecoords[type][i].x) {
        maxx=featurecoords[type][i].x;
      }
    }


    if(miny==-1) {
      miny=featurecoords[type][i].y;
    } else {
      if(miny>featurecoords[type][i].y) {
        miny=featurecoords[type][i].y;
      }
    }

    if(maxy==-1) {
      maxy=featurecoords[type][i].y;
    } else {
      if(maxy<featurecoords[type][i].y) {
        maxy=featurecoords[type][i].y;
      }
    }
  }

  if(miny>maxy) {
    console.log('Error: something wrong with '+type+' coords');
    return;
  }

  miny=Math.min(miny,browy);

  var drawbox=[minx,miny,maxx,maxy];

  var draww=drawbox[2]-drawbox[0];
  var drawh=drawbox[3]-drawbox[1];

  drawbox[0]=Math.round(drawbox[0]-draww*0.4);
  drawbox[2]=Math.round(drawbox[2]+draww*0.4);

  draww=drawbox[2]-drawbox[0];

  var blurradius=Math.max(1,Math.round(draww*0.01));

  var bluroff=blurradius*2;
  var newx0=Math.max(0,drawbox[0]-bluroff);
  var newy0=Math.max(0,drawbox[1]-bluroff);
  var newx1=Math.min(canvas.width-1,drawbox[2]+bluroff);
  var newy1=Math.min(canvas.height-1,drawbox[3]+bluroff);

  var blurw=newx1-newx0;
  var blurh=newy1-newy0;


  canvas_draw.width=blurw;
  canvas_draw.height=blurh;

  //canvas_draw.style.backgroundColor="rgba("+r+","+g+","+b+",1)";

  context_draw.clearRect(0, 0, blurw, blurh);

  if(type=="reye") {
    if(reviewpoints) {
      drawpnts['xoff']=newx0;
      drawpnts['yoff']=newy0;
    }
  }

  drawfunc( 'canvas_draw',
            featurecoords[type][0].x-newx0,featurecoords[type][0].y-newy0,
            featurecoords[type][1].x-newx0,featurecoords[type][1].y-newy0,
            featurecoords[type][2].x-newx0,featurecoords[type][2].y-newy0,
            featurecoords[type][3].x-newx0,featurecoords[type][3].y-newy0,
            featurecoords[type][4].x-newx0,featurecoords[type][4].y-newy0,
            featurecoords[type][6].x-newx0,featurecoords[type][6].y-newy0,
            browy-newy0,
            r,g,b,op );


  var myImageData=toGreyScale('canvas_draw','canvas_grey');
  myImageData=boxBlurDataRGB(myImageData, 0, 0, blurw, blurh, blurradius, 1);
  copyAlpha(myImageData,'canvas_draw',r,g,b);

//  boxBlurCanvasRGBA('canvas_draw', 0, 0, blurw, blurh, blurradius, 1);
//  stackBlurCanvasRGBA('canvas_draw', 0, 0, blurw, blurh, blurradius);
//  integralBlurCanvasRGBA( 'canvas_draw', 0, 0, blurw, blurh, blurradius, 1);
//  stackBoxBlurCanvasRGBA('canvas_draw', 0, 0, blurw, blurh, blurradius,1);

  context.drawImage(canvas_draw,newx0,newy0);
}


var mylashname="sp_lsh_1794924_20160601163914";

var lashimg_r = new Image;
var lashimg_r_loaded=0;
lashimg_r.onload=function() {lashimg_r_loaded=1;};
lashimg_r.src = "lash/"+mylashname+"_r.png";

var lashimg_l = new Image;
var lashimg_l_loaded=0;
lashimg_l.onload=function() {lashimg_l_loaded=1;};
lashimg_l.src = "lash/"+mylashname+"_l.png";

function scaleInStep(origimg,targetw,targeth,origw,origh,numstep) {
  var stepw=(origw-targetw)/numstep;
  var steph=(origh-targeth)/numstep;

  var neww=Math.round(origw-stepw);
  var newh=Math.round(origh-steph);

  var tempcanvas = document.createElement('canvas');
  tempcanvas.width = neww;
  tempcanvas.height = newh;
  var tempctx = tempcanvas.getContext('2d');

  tempctx.drawImage(origimg, 0, 0, neww, newh);

  var newcanvas=tempcanvas;
  var newctx;

  for(var i=1;i<numstep;i++) {
    var oldw=Math.round(origw-(stepw*i));
    var oldh=Math.round(origh-(steph*i));

    var neww=Math.round(origw-(stepw*(i+1)));
    var newh=Math.round(origh-(steph*(i+1)));

    tempcanvas=newcanvas;
    newcanvas = document.createElement('canvas');
    newcanvas.width = neww;
    newcanvas.height = newh;
    newctx = newcanvas.getContext('2d');

    newctx.drawImage(tempcanvas, 0, 0, oldw, oldh, 0, 0, neww, newh);
  }

  return newcanvas;
}

function eyelash_draw(type,lash,oop,faceangle,isBottom) {
  if(lashimgarray[lash]['loaded']==0) {
    return;
  }

  if(typeof isBottom=="undefined") {
    isBottom="NO";
  }

  if(type=='reye') {
    var browtype='rbrow';
    var lashimg=lashimgarray[lash]['obj'];
    var lashflip=0;
  } else if(type=='leye') {
    var browtype='lbrow';
    var lashimg=lashimgarray[lash]['obj'];
    var lashflip=1;
  } else {
    console.log('Error: Unsupported type '+type);
    return;
  }
  var origlashw=200;
  var origlashh=130;

  var op=oop;

  var browy=Math.round((featurecoords[browtype][0].y + featurecoords[browtype][1].y + featurecoords[browtype][2].y) / 3);

  if(featurecoords[type].length==0) {
    console.log('Error: '+type+' length is 0');
    return;
  }

  var minx=-1,maxx=-1;
  var miny=-1,maxy=-1;
  for(var i=0,l=featurecoords[type].length;i<l;i++) {
    if(minx==-1) {
      minx=featurecoords[type][i].x;
    } else {
      if(minx>featurecoords[type][i].x) {
        minx=featurecoords[type][i].x;
      }
    }

    if(maxx==-1) {
      maxx=featurecoords[type][i].x;
    } else {
      if(maxx<featurecoords[type][i].x) {
        maxx=featurecoords[type][i].x;
      }
    }


    if(miny==-1) {
      miny=featurecoords[type][i].y;
    } else {
      if(miny>featurecoords[type][i].y) {
        miny=featurecoords[type][i].y;
      }
    }

    if(maxy==-1) {
      maxy=featurecoords[type][i].y;
    } else {
      if(maxy<featurecoords[type][i].y) {
        maxy=featurecoords[type][i].y;
      }
    }
  }

  if(miny>maxy) {
    console.log('Error: something wrong with '+type+' coords');
    return;
  }

  //miny=Math.min(miny,browy);
  var eyew=maxx-minx;
  var eyeh=maxy-miny;

  if(isBottom=="NO") {
    var lashtop_ratio=1.57;
    var lashbtm_ratio=0.73;

    var lashout_ratio=0.77;
    var lashin_ratio=0.0;
  } else {
    var lashtop_ratio=0.04;
    var lashbtm_ratio=3.18;

    var lashout_ratio=0.84;
    var lashin_ratio=-0.08;
  }

  if(type=="reye") {
    var lashbox=[Math.round(minx-(lashin_ratio)*eyew),miny-eyeh*lashtop_ratio,Math.round(maxx+(lashout_ratio)*eyew),Math.round((maxy+miny)/2 + eyeh*lashbtm_ratio)];
  } else {
    var lashbox=[Math.round(minx-(lashout_ratio)*eyew),miny-eyeh*lashtop_ratio,Math.round(maxx+(lashin_ratio)*eyew),Math.round((maxy+miny)/2 + eyeh*lashbtm_ratio)];
  }

  var lashboxexp=1.2;

  var lashboxw=(lashbox[2]-lashbox[0]);
  var lashboxh=(lashbox[3]-lashbox[1]);

  var drawbox=[Math.round(lashbox[0]-((lashboxexp-1)/2)*lashboxw),Math.round(lashbox[1]-((lashboxexp-1)/2)*lashboxh),Math.round(lashbox[2]+((lashboxexp-1)/2)*lashboxw),Math.round(lashbox[3]+((lashboxexp-1)/2)*lashboxh)];
  var drawboxw=(drawbox[2]-drawbox[0]);
  var drawboxh=(drawbox[3]-drawbox[1]);

  var tempcanvas = document.getElementById('canvas_draw');

  tempcanvas.width=drawboxw;
  tempcanvas.height=drawboxh;

  var tempcanvas_context = tempcanvas.getContext('2d');

  tempcanvas_context.clearRect(0, 0, drawboxw, drawboxh);

  if(isBottom=="NO") {
    var rotTransX=0.33;
    var rotTransY=0.70;
  } else {
    var rotTransX=0.23;
    var rotTransY=0.14;
  }

  if(lashflip==1) {
    tempcanvas_context.translate(drawboxw, 0);
    tempcanvas_context.scale(-1, 1);

    tempcanvas_context.translate(drawboxw*rotTransX,drawboxh*rotTransY);
    tempcanvas_context.rotate(-1*faceangle);
  } else {
    tempcanvas_context.translate(drawboxw*rotTransX,drawboxh*rotTransY);
    tempcanvas_context.rotate(faceangle);
  }

  var scalecanvas=scaleInStep(lashimg,lashboxw,lashboxh,origlashw,origlashh,5);
  tempcanvas_context.drawImage(scalecanvas,Math.round((drawboxw-lashboxw)/2)-drawboxw*rotTransX,Math.round((drawboxh-lashboxh)/2)-drawboxh*rotTransY,lashboxw,lashboxh); // Or at whatever offset you like

  context.drawImage(canvas_draw,drawbox[0],drawbox[1]);
}



function right_shadow_draw(canv,x0,y0,x1,y1,x2,y2,x3,y3,browy,r,g,b,op)
{
      var shadow_r = document.getElementById(canv);
      var shadow_r_context = shadow_r.getContext('2d');

      shadow_r_context.beginPath();
      shadow_r_context.moveTo(x0, y0);

shadow_r_context.bezierCurveTo(x1-(x2-x0)/2,browy-(y1-browy)/2,x1+(x2-x0)*5/4,browy-(y1-browy)/4,x2,y2);

shadow_r_context.bezierCurveTo(x1+(x2-x0)/5,y1-((y2+y0)/2-y1)/3,x1-(x2-x0)/5,y1-((y2+y0)/2-y1)/3,x0,y0);

      shadow_r_context.closePath();
      shadow_r_context.lineWidth = 0;
      var grd =
shadow_r_context.createRadialGradient(x1,(y0+y2)/2,(x2-x0)/6,x1+(x2-x0)/3,(y0+y2)/2,(x2-x0)*7/8);
      grd.addColorStop(0, 'rgba('+r+','+g+','+b+','+(op*0.6)+')');
      grd.addColorStop(0.4, 'rgba('+r+','+g+','+b+','+(op*0.3)+')');
      grd.addColorStop(0.6, 'rgba('+r+','+g+','+b+','+(op*0.1)+')');
      grd.addColorStop(0.8, 'rgba('+r+','+g+','+b+','+(op*0.02)+')');
      grd.addColorStop(1, 'rgba('+r+','+g+','+b+',0)');
      shadow_r_context.fillStyle = grd;
      shadow_r_context.fill();
}


function left_shadow_draw(canv,x0,y0,x1,y1,x2,y2,x3,y3,browy,r,g,b,op)
{
      var shadow_l = document.getElementById(canv);
      var shadow_l_context = shadow_l.getContext('2d');

//      shadow_l_context.clearRect(0, 0, shadow_l.width, shadow_l.height);

      shadow_l_context.beginPath();
      shadow_l_context.moveTo(x2, y2);

shadow_l_context.bezierCurveTo(x1+(x2-x0)/2,browy-(y1-browy)/2,x1-(x2-x0)*5/4,browy-(y1-browy)/4,x0,y0);
      shadow_l_context.bezierCurveTo(x1-(x2-x0)/5,y1-((y2+y0)/2-y1)/3,x1+(x2-x0)/5,y1-((y2+y0)/2-y1)/3,x2,y2);



      shadow_l_context.closePath();
      shadow_l_context.lineWidth = 0;
      var grd =
shadow_l_context.createRadialGradient(x1,(y0+y2)/2,(x2-x0)/6,x1-(x2-x0)/3,(y0+y2)/2,(x2-x0)*7/8);
      grd.addColorStop(0, 'rgba('+r+','+g+','+b+','+(op*0.6)+')');
      grd.addColorStop(0.4, 'rgba('+r+','+g+','+b+','+(op*0.3)+')');
      grd.addColorStop(0.6, 'rgba('+r+','+g+','+b+','+(op*0.1)+')');
      grd.addColorStop(0.8, 'rgba('+r+','+g+','+b+','+(op*0.02)+')');
      grd.addColorStop(1, 'rgba('+r+','+g+','+b+',0)');
      shadow_l_context.fillStyle = grd;
      shadow_l_context.fill();
}


/***** Sephora 3.0 eyeshadow addition *****/
function right_shadow_draw0(canv,x0,y0,x1,y1,x2,y2,x3,y3,browy,r,g,b,op)
{

      var shadow_r = document.getElementById(canv);
      var shadow_r_context = shadow_r.getContext('2d');

	var width=Math.abs(x2-x0);
	var height=Math.abs(y1-browy);


      shadow_r_context.beginPath();
      shadow_r_context.moveTo(x2-width/2,y2-height/3);

shadow_r_context.bezierCurveTo(x2-width/3,y2-height*1.5,x2+width*3/4,y2-height*1.5,x2,y2);
shadow_r_context.bezierCurveTo(x2+width/4,y2-height/4,x2-width/4,y2-height/4,x2-width/2,y2-height/3);

      shadow_r_context.closePath();
      shadow_r_context.lineWidth = 0;
      var grd =
shadow_r_context.createRadialGradient(x2-width/10,y2-height*2/3,0,x2-width/10,y2-height*2/3,height);
      grd.addColorStop(0, 'rgba('+r+','+g+','+b+','+(op*0.3)+')');
      grd.addColorStop(0.4, 'rgba('+r+','+g+','+b+','+(op*0.1)+')');
      grd.addColorStop(0.7, 'rgba('+r+','+g+','+b+','+(op*0.05)+')');
      grd.addColorStop(1, 'rgba('+r+','+g+','+b+','+(op*0.0)+')');

      shadow_r_context.fillStyle = grd;

      shadow_r_context.fill();
}


function left_shadow_draw0(canv,x0,y0,x1,y1,x2,y2,x3,y3,browy,r,g,b,op)
{
      var shadow_l = document.getElementById(canv);
      var shadow_l_context = shadow_l.getContext('2d');

	var width=Math.abs(x2-x0);
	var height=Math.abs(y1-browy);


      shadow_l_context.beginPath();
      shadow_l_context.moveTo(x0+width/2,y2-height/3);

shadow_l_context.bezierCurveTo(x0+width/3,y2-height*1.5,x0-width*3/4,y2-height*1.5,x0,y2);
shadow_l_context.bezierCurveTo(x0-width/4,y2-height/4,x0+width/4,y2-height/4,x0+width/2,y2-height/3);

      shadow_l_context.closePath();
      shadow_l_context.lineWidth = 0;
      var grd =
shadow_l_context.createRadialGradient(x0+width/10,y2-height*2/3,0,x0+width/10,y2-height*2/3,height);
      grd.addColorStop(0, 'rgba('+r+','+g+','+b+','+(op*0.3)+')');
      grd.addColorStop(0.4, 'rgba('+r+','+g+','+b+','+(op*0.1)+')');
      grd.addColorStop(0.7, 'rgba('+r+','+g+','+b+','+(op*0.05)+')');
      grd.addColorStop(1, 'rgba('+r+','+g+','+b+','+(op*0.0)+')');

      shadow_l_context.fillStyle = grd;

//      shadow_l_context.fillStyle = 'rgba('+r+','+g+','+b+',0.2)';
      shadow_l_context.fill();


}


function right_shadow_draw1(canv,x0,yy0,x1,yy1,x2,yy2,x3,yy3,bbrowy,r,g,b,op)
{

	var height=Math.abs(yy1-bbrowy);
	var bias=height/10*4;
	var y0=yy0+bias;
	var y1=yy1+bias;
	var y2=yy2+bias;
	var y3=yy3+bias;
	var browy=bbrowy+bias;

      var shadow_r = document.getElementById(canv);
      var shadow_r_context = shadow_r.getContext('2d');

	var width=Math.abs(x2-x0);

      shadow_r_context.beginPath();
      shadow_r_context.moveTo(x0, y0);

//shadow_r_context.bezierCurveTo(x1-(x2-x0)/2,browy-(y1-browy)/3,x1+(x2-x0)*5/4,browy-(y1-browy)/4,x2,y2);
shadow_r_context.bezierCurveTo(x0-width/4,browy-(y1-browy)/3,x2+width*2/3,browy-(y1-browy)/3,x2+width/8,y2);

shadow_r_context.bezierCurveTo(x1+(x2-x0)/5,y1-((y2+y0)/2-y1)/3,x1-(x2-x0)/5,y1-((y2+y0)/2-y1)/3,x0,y0);

      shadow_r_context.closePath();
      shadow_r_context.lineWidth = 0;

      var grd =
shadow_r_context.createRadialGradient(x2-width*2/3,y1+3*height,0,x2-width*2/3,y1+3*height,height*4);
      grd.addColorStop(0, 'rgba('+r+','+g+','+b+','+(op*0.0)+')');
      grd.addColorStop(0.8, 'rgba('+r+','+g+','+b+','+(op*0.0)+')');
      grd.addColorStop(0.9, 'rgba('+r+','+g+','+b+','+(op*0.2)+')');
      grd.addColorStop(1, 'rgba('+r+','+g+','+b+','+(op*0.1)+')');
      shadow_r_context.fillStyle = grd;

      shadow_r_context.fill();
}


function left_shadow_draw1(canv,x0,yy0,x1,yy1,x2,yy2,x3,yy3,bbrowy,r,g,b,op)
{

	var height=Math.abs(yy1-bbrowy);
	var bias=height/10*4;
	var y0=yy0+bias;
	var y1=yy1+bias;
	var y2=yy2+bias;
	var y3=yy3+bias;
	var browy=bbrowy+bias;

      var shadow_l = document.getElementById(canv);
      var shadow_l_context = shadow_l.getContext('2d');

	var width=Math.abs(x2-x0);
	var height=Math.abs(y1-browy);

      shadow_l_context.beginPath();
      shadow_l_context.moveTo(x2, y2);



shadow_l_context.bezierCurveTo(x2+width/4,browy-(y1-browy)/3,x0-width*2/3,browy-(y1-browy)/3,x0-width/8,y0);

shadow_l_context.bezierCurveTo(x1-(x2-x0)/5,y1-((y2+y0)/2-y1)/3,x1+(x2-x0)/5,y1-((y2+y0)/2-y1)/3,x2,y2);

      shadow_l_context.closePath();
      shadow_l_context.lineWidth = 0;

      var grd =
shadow_l_context.createRadialGradient(x0+width*2/3,y1+3*height,0,x0+width*2/3,y1+3*height,height*4);
      grd.addColorStop(0, 'rgba('+r+','+g+','+b+','+(op*0.0)+')');
      grd.addColorStop(0.8, 'rgba('+r+','+g+','+b+','+(op*0.0)+')');
      grd.addColorStop(0.9, 'rgba('+r+','+g+','+b+','+(op*0.2)+')');
      grd.addColorStop(1, 'rgba('+r+','+g+','+b+','+(op*0.1)+')');
      shadow_l_context.fillStyle = grd;

      shadow_l_context.fill();
}


function right_shadow_draw2(canv,x0,y0,x1,y1,x2,y2,x3,y3,browy,r,g,b,op)
{
      var shadow_r = document.getElementById(canv);
      var shadow_r_context = shadow_r.getContext('2d');

      shadow_r_context.beginPath();
      shadow_r_context.moveTo(x0, y0);

//shadow_r_context.bezierCurveTo(x1-(x2-x0)/2,browy-0*(y1-browy)/2,x1+(x2-x0)*5/4,browy-(y1-browy)/4,x2,y2);
shadow_r_context.bezierCurveTo(x1-(x2-x0)/2-100,browy+0*(y1-browy)/2,x1+(x2-x0)*5/4,browy+(y1-browy)/4,x2,y2);

shadow_r_context.bezierCurveTo(x1+(x2-x0)/5,y1-((y2+y0)/2-y1)/3,x1-(x2-x0)/5,y1-((y2+y0)/2-y1)/3,x0,y0);

      shadow_r_context.closePath();
      shadow_r_context.lineWidth = 0;
      var grd =
shadow_r_context.createRadialGradient(x1,(y0+y2)/2,(x2-x0)/6,x1+0*(x2-x0)/3,(y0+y2)/2,(x2-x0)*7/8);
      grd.addColorStop(0, 'rgba('+r+','+g+','+b+','+(op*0.6)+')');
      grd.addColorStop(0.4, 'rgba('+r+','+g+','+b+','+(op*0.3)+')');
      grd.addColorStop(0.6, 'rgba('+r+','+g+','+b+','+(op*0.1)+')');
      grd.addColorStop(0.8, 'rgba('+r+','+g+','+b+','+(op*0.02)+')');
      grd.addColorStop(1, 'rgba('+r+','+g+','+b+',0)');
      shadow_r_context.fillStyle = grd;
      shadow_r_context.fill();
}


function left_shadow_draw2(canv,x0,y0,x1,y1,x2,y2,x3,y3,browy,r,g,b,op)
{
      var shadow_l = document.getElementById(canv);
      var shadow_l_context = shadow_l.getContext('2d');

//      shadow_l_context.clearRect(0, 0, shadow_l.width, shadow_l.height);

      shadow_l_context.beginPath();
      shadow_l_context.moveTo(x2, y2);

//shadow_l_context.bezierCurveTo(x1+(x2-x0)/2,browy-(y1-browy)/2,x1-(x2-x0)*5/4,browy-(y1-browy)/4,x0,y0);
shadow_l_context.bezierCurveTo(x1+(x2-x0)/2+100,browy-0*(y1-browy)/2,x1-(x2-x0)*5/4,browy+(y1-browy)/4,x0,y0);
      shadow_l_context.bezierCurveTo(x1-(x2-x0)/5,y1-((y2+y0)/2-y1)/3,x1+(x2-x0)/5,y1-((y2+y0)/2-y1)/3,x2,y2);



      shadow_l_context.closePath();
      shadow_l_context.lineWidth = 0;
      var grd =
shadow_l_context.createRadialGradient(x1,(y0+y2)/2,(x2-x0)/6,x1-0*(x2-x0)/3,(y0+y2)/2,(x2-x0)*7/8);
      grd.addColorStop(0, 'rgba('+r+','+g+','+b+','+(op*0.6)+')');
      grd.addColorStop(0.4, 'rgba('+r+','+g+','+b+','+(op*0.3)+')');
      grd.addColorStop(0.6, 'rgba('+r+','+g+','+b+','+(op*0.1)+')');
      grd.addColorStop(0.8, 'rgba('+r+','+g+','+b+','+(op*0.02)+')');
      grd.addColorStop(1, 'rgba('+r+','+g+','+b+',0)');
      shadow_l_context.fillStyle = grd;
      shadow_l_context.fill();
}












function right_exactliner_draw(canv,x0,y0,xsub0,ysub0,x1,y1,xsub1,ysub1,x2,y2,x3,y3,browy,r,g,b,op)
{
      var shadow_r = document.getElementById(canv);
      var shadow_r_context = shadow_r.getContext('2d');

      shadow_r_context.beginPath();
      shadow_r_context.moveTo(x0, y0);

//outer-upper: x0->olp0->ol0->ol1
//inner-upper: x2->il0->ilp0->x0

//get outer liner intermediate points
var olp0={'x':xsub0,'y':(ysub0-(y0-browy)/28)};
var ol0={'x':x1,'y':(y1-(y0-browy)/15)};
var ol1={'x':x2+(x2-x0)/5,'y':y2-(y0-browy)/20};

//get lengths
var l_0_ol0=Math.sqrt((x0-ol0.x)*(x0-ol0.x)+(y0-ol0.y)*(y0-ol0.y));
var l_0_olp0=Math.sqrt((x0-olp0.x)*(x0-olp0.x)+(y0-olp0.y)*(y0-olp0.y));
var l_olp0_1=Math.sqrt((olp0.x-x1)*(olp0.x-x1)+(olp0.y-y1)*(olp0.y-y1));

var l_olp0_ol1=Math.sqrt((olp0.x-ol1.x)*(olp0.x-ol1.x)+(olp0.y-ol1.y)*(olp0.y-ol1.y));
var l_olp0_ol0=Math.sqrt((olp0.x-ol0.x)*(olp0.x-ol0.x)+(olp0.y-ol0.y)*(olp0.y-ol0.y));
var l_ol0_ol1=Math.sqrt((ol0.x-ol1.x)*(ol0.x-ol1.x)+(ol0.y-ol1.y)*(ol0.y-ol1.y));

//get unit vectors
var olp0_cp0_uV={'x':(x0-ol0.x)/l_0_ol0,'y':(y0-ol0.y)/l_0_ol0};
var olp0_cp1_uV={'x':olp0_cp0_uV.x*-1,'y':olp0_cp0_uV.y*-1};

var ol0_cp0_uV={'x':(olp0.x-ol1.x)/l_olp0_ol1,'y':(olp0.y-ol1.y)/l_olp0_ol1};
var ol0_cp1_uV={'x':ol0_cp0_uV.x*-1,'y':ol0_cp0_uV.y*-1};


//control point length coefficient
var olp0_cp_coeff=0.26;
var ol0_cp_coeff=0.24;


/* PATH 0: outer upper */
//use sub0 for x0 control point
/*
shadow_r_context.bezierCurveTo(x0,y0,olp0.x+olp0_cp0_uV.x*l_0_olp0*olp0_cp_coeff,olp0.y+olp0_cp0_uV.y*l_0_olp0*olp0_cp_coeff,olp0.x,olp0.y);
shadow_r_context.bezierCurveTo(olp0.x+olp0_cp1_uV.x*l_olp0_ol0*olp0_cp_coeff,olp0.y+olp0_cp1_uV.y*l_olp0_ol0*olp0_cp_coeff,ol0.x+ol0_cp0_uV.x*l_olp0_ol0*ol0_cp_coeff,ol0.y+ol0_cp0_uV.y*l_olp0_ol0*ol0_cp_coeff,ol0.x,ol0.y);
shadow_r_context.bezierCurveTo(ol0.x+ol0_cp1_uV.x*l_olp0_ol0*ol0_cp_coeff,ol0.y+ol0_cp1_uV.y*l_olp0_ol0*ol0_cp_coeff,xsub1,ysub1-(y0-ol0.y)/3,ol1.x,ol1.y);
*/
//shadow_r_context.bezierCurveTo(x0+(x2-x0)*2/7,y1-(y0-browy)/20,x1,y1-(y0-browy)/6,x2+(x2-x0)/5,y2-(y0-browy)/20);
shadow_r_context.bezierCurveTo(xsub0,(ysub0-(y0-browy)/5),x1,y1-(y0-browy)/5,ol1.x,ol1.y);

/* PATH 1: outer lower */
shadow_r_context.bezierCurveTo(x3,y3+(y0-browy)/8,x3,y3+(y0-browy)/50,x0,y0);

/* PATH 2: inner lower */
shadow_r_context.bezierCurveTo(x3,y3+(y0-browy)/100,x3,y3+(y0-browy)/100,x2,y2);

//inner x1
var il0={'x':x1,'y':(y1+(y0-browy)/20)};
var ilp0={'x':xsub0,'y':(ysub0+(y0-browy)/30)};

//get lengths
var l_ilp0_2=Math.sqrt((ilp0.x-x2)*(ilp0.x-x2)+(ilp0.y-y2)*(ilp0.y-y2));
var l_2_il0=Math.sqrt((x2-il0.x)*(x2-il0.x)+(y2-il0.y)*(y2-il0.y));
var l_il0_ilp0=Math.sqrt((il0.x-ilp0.x)*(il0.x-ilp0.x)+(il0.y-ilp0.y)*(il0.y-ilp0.y));

var l_0_il0=Math.sqrt((x0-il0.x)*(x0-il0.x)+(y0-il0.y)*(y0-il0.y));
var l_il0_ilp0=Math.sqrt((il0.x-ilp0.x)*(il0.x-ilp0.x)+(il0.y-ilp0.y)*(il0.y-ilp0.y));
var l_ilp0_0=Math.sqrt((ilp0.x-x0)*(ilp0.x-x0)+(ilp0.y-y0)*(ilp0.y-y0));

//get unit vectors
var il0_cp0_uV={'x':(x2-ilp0.x)/l_ilp0_2,'y':(y2-ilp0.y)/l_ilp0_2};
var il0_cp1_uV={'x':il0_cp0_uV.x*-1,'y':il0_cp0_uV.y*-1};

var ilp0_cp0_uV={'x':(il0.x-x0)/l_0_il0,'y':(il0.y-y0)/l_0_il0};
var ilp0_cp1_uV={'x':ilp0_cp0_uV.x*-1,'y':ilp0_cp0_uV.y*-1};

//control point length coefficient
var il0_cp_coeff=0.20;
var ilp0_cp_coeff=0.20;


/* PATH 3: inner upper */
shadow_r_context.bezierCurveTo(xsub1,ysub1+(y0-il0.y)/20,il0.x+il0_cp0_uV.x*l_2_il0*il0_cp_coeff,il0.y+il0_cp0_uV.y*l_2_il0*il0_cp_coeff,il0.x,il0.y);
shadow_r_context.bezierCurveTo(il0.x+il0_cp1_uV.x*l_0_il0*il0_cp_coeff,il0.y+il0_cp1_uV.y*l_0_il0*il0_cp_coeff,ilp0.x+ilp0_cp0_uV.x*l_il0_ilp0*ilp0_cp_coeff,ilp0.y+ilp0_cp0_uV.y*l_il0_ilp0*ilp0_cp_coeff,ilp0.x,ilp0.y);
shadow_r_context.bezierCurveTo(ilp0.x+ilp0_cp1_uV.x*l_ilp0_0*ilp0_cp_coeff,ilp0.y+ilp0_cp1_uV.y*l_ilp0_0*ilp0_cp_coeff,x0,y0,x0,y0);


      shadow_r_context.closePath();
      shadow_r_context.lineWidth = 0;
      shadow_r_context.fillStyle = "rgba("+r+","+g+","+b+","+op+")";
      shadow_r_context.fill();


if(reviewpoints) {
drawpnts['pnts'].push({'x':x0,'y':y0});
drawpnts['pnts'].push({'x':olp0.x,'y':olp0.y});
drawpnts['pnts'].push({'x':ol0.x,'y':ol0.y});
drawpnts['pnts'].push({'x':ol1.x,'y':ol1.y});

drawpnts['pnts'].push({'x':olp0.x+olp0_cp0_uV.x*l_0_olp0*olp0_cp_coeff,'y':olp0.y+olp0_cp0_uV.y*l_0_olp0*olp0_cp_coeff});
drawpnts['pnts'].push({'x':olp0.x+olp0_cp1_uV.x*l_olp0_ol0*olp0_cp_coeff,'y':olp0.y+olp0_cp1_uV.y*l_olp0_ol0*olp0_cp_coeff});

drawpnts['pnts'].push({'x':ol0.x+ol0_cp0_uV.x*l_olp0_ol0*ol0_cp_coeff,'y':ol0.y+ol0_cp0_uV.y*l_olp0_ol0*ol0_cp_coeff});
drawpnts['pnts'].push({'x':ol0.x+ol0_cp1_uV.x*l_olp0_ol0*ol0_cp_coeff,'y':ol0.y+ol0_cp1_uV.y*l_olp0_ol0*ol0_cp_coeff});
}

}


function left_exactliner_draw(canv,x0,y0,xsub0,ysub0,x1,y1,xsub1,ysub1,x2,y2,x3,y3,browy,r,g,b,op)
{
      var shadow_r = document.getElementById(canv);
      var shadow_r_context = shadow_r.getContext('2d');

      shadow_r_context.beginPath();
      shadow_r_context.moveTo(x2, y2);

//outer-upper: x2->olp0->ol0->ol1
//inner-upper: x0->il0->ilp0->x2

//get outer liner intermediate points
var olp0={'x':xsub1,'y':(ysub1-(y2-browy)/28)};
var ol0={'x':x1,'y':(y1-(y2-browy)/15)};
var ol1={'x':x0+(x0-x2)/5,'y':y0-(y2-browy)/20};

//get lengths
var l_2_ol0=Math.sqrt((x2-ol0.x)*(x2-ol0.x)+(y2-ol0.y)*(y2-ol0.y));
var l_2_olp0=Math.sqrt((x2-olp0.x)*(x2-olp0.x)+(y2-olp0.y)*(y2-olp0.y));
var l_olp0_1=Math.sqrt((olp0.x-x1)*(olp0.x-x1)+(olp0.y-y1)*(olp0.y-y1));

var l_olp0_ol1=Math.sqrt((olp0.x-ol1.x)*(olp0.x-ol1.x)+(olp0.y-ol1.y)*(olp0.y-ol1.y));
var l_olp0_ol0=Math.sqrt((olp0.x-ol0.x)*(olp0.x-ol0.x)+(olp0.y-ol0.y)*(olp0.y-ol0.y));
var l_ol0_ol1=Math.sqrt((ol0.x-ol1.x)*(ol0.x-ol1.x)+(ol0.y-ol1.y)*(ol0.y-ol1.y));

//get unit vectors
var olp0_cp0_uV={'x':(x2-ol0.x)/l_2_ol0,'y':(y2-ol0.y)/l_2_ol0};
var olp0_cp1_uV={'x':olp0_cp0_uV.x*-1,'y':olp0_cp0_uV.y*-1};

var ol0_cp0_uV={'x':(olp0.x-ol1.x)/l_olp0_ol1,'y':(olp0.y-ol1.y)/l_olp0_ol1};
var ol0_cp1_uV={'x':ol0_cp0_uV.x*-1,'y':ol0_cp0_uV.y*-1};


//control point length coefficient
var olp0_cp_coeff=0.26;
var ol0_cp_coeff=0.24;


/* PATH 0: outer upper */
//use sub1 for x2 control point
/*
shadow_r_context.bezierCurveTo(x2,y2,olp0.x+olp0_cp0_uV.x*l_2_olp0*olp0_cp_coeff,olp0.y+olp0_cp0_uV.y*l_2_olp0*olp0_cp_coeff,olp0.x,olp0.y);
shadow_r_context.bezierCurveTo(olp0.x+olp0_cp1_uV.x*l_olp0_ol0*olp0_cp_coeff,olp0.y+olp0_cp1_uV.y*l_olp0_ol0*olp0_cp_coeff,ol0.x+ol0_cp0_uV.x*l_olp0_ol0*ol0_cp_coeff,ol0.y+ol0_cp0_uV.y*l_olp0_ol0*ol0_cp_coeff,ol0.x,ol0.y);
shadow_r_context.bezierCurveTo(ol0.x+ol0_cp1_uV.x*l_olp0_ol0*ol0_cp_coeff,ol0.y+ol0_cp1_uV.y*l_olp0_ol0*ol0_cp_coeff,xsub0,ysub0-(y2-ol0.y)/3,ol1.x,ol1.y);
*/
shadow_r_context.bezierCurveTo(xsub1,(ysub1-(y2-browy)/5),x1,y1-(y2-browy)/5,ol1.x,ol1.y);

/* PATH 1: outer lower */
shadow_r_context.bezierCurveTo(x3,y3+(y2-browy)/8,x3,y3+(y2-browy)/50,x2,y2);

/* PATH 2: inner lower */
shadow_r_context.bezierCurveTo(x3,y3+(y2-browy)/100,x3,y3+(y2-browy)/100,x0,y0);


//inner x1
var il0={'x':x1,'y':(y1+(y2-browy)/20)};
var ilp0={'x':xsub1,'y':(ysub1+(y2-browy)/30)};

//get lengths
var l_ilp0_0=Math.sqrt((ilp0.x-x0)*(ilp0.x-x0)+(ilp0.y-y0)*(ilp0.y-y0));
var l_0_il0=Math.sqrt((x0-il0.x)*(x0-il0.x)+(y0-il0.y)*(y0-il0.y));
var l_il0_ilp0=Math.sqrt((il0.x-ilp0.x)*(il0.x-ilp0.x)+(il0.y-ilp0.y)*(il0.y-ilp0.y));

var l_il0_ilp0=Math.sqrt((il0.x-ilp0.x)*(il0.x-ilp0.x)+(il0.y-ilp0.y)*(il0.y-ilp0.y));
var l_ilp0_2=Math.sqrt((ilp0.x-x2)*(ilp0.x-x2)+(ilp0.y-y2)*(ilp0.y-y2));
var l_2_il0=Math.sqrt((x2-il0.x)*(x2-il0.x)+(y2-il0.y)*(y2-il0.y));

//get unit vectors
var il0_cp0_uV={'x':(x0-ilp0.x)/l_ilp0_0,'y':(y0-ilp0.y)/l_ilp0_0};
var il0_cp1_uV={'x':il0_cp0_uV.x*-1,'y':il0_cp0_uV.y*-1};

var ilp0_cp0_uV={'x':(il0.x-x2)/l_2_il0,'y':(il0.y-y2)/l_2_il0};
var ilp0_cp1_uV={'x':ilp0_cp0_uV.x*-1,'y':ilp0_cp0_uV.y*-1};

//control point length coefficient
var il0_cp_coeff=0.20;
var ilp0_cp_coeff=0.20;


/* PATH 3: inner upper */
shadow_r_context.bezierCurveTo(xsub0,ysub0+(y2-il0.y)/20,il0.x+il0_cp0_uV.x*l_0_il0*il0_cp_coeff,il0.y+il0_cp0_uV.y*l_0_il0*il0_cp_coeff,il0.x,il0.y);
shadow_r_context.bezierCurveTo(il0.x+il0_cp1_uV.x*l_2_il0*il0_cp_coeff,il0.y+il0_cp1_uV.y*l_2_il0*il0_cp_coeff,ilp0.x+ilp0_cp0_uV.x*l_il0_ilp0*ilp0_cp_coeff,ilp0.y+ilp0_cp0_uV.y*l_il0_ilp0*ilp0_cp_coeff,ilp0.x,ilp0.y);
shadow_r_context.bezierCurveTo(ilp0.x+ilp0_cp1_uV.x*l_ilp0_2*ilp0_cp_coeff,ilp0.y+ilp0_cp1_uV.y*l_ilp0_2*ilp0_cp_coeff,x2,y2,x2,y2);

      shadow_r_context.closePath();
      shadow_r_context.lineWidth = 0;
      shadow_r_context.fillStyle = "rgba("+r+","+g+","+b+","+op+")";
      shadow_r_context.fill();

}


var drawpnts={'xoff':0,'yoff':0,'pnts':[]};
function drawpoints() {
  for(var i=0,l=drawpnts['pnts'].length;i<l;i++) {
    context.beginPath();
    context.fillStyle = "rgba(80,255,200,255)";
    context.arc(drawpnts['pnts'][i].x+drawpnts['xoff'], drawpnts['pnts'][i].y+drawpnts['yoff'], 1, 0, 2 * Math.PI, true);
    context.closePath();
    context.fill();
  }
}



function right_liner_draw(canv,x0,y0,x1,y1,x2,y2,x3,y3,browy,r,g,b,op)
{
      var shadow_r = document.getElementById(canv);
      var shadow_r_context = shadow_r.getContext('2d');

//      shadow_r_context.clearRect(0, 0, shadow_r.width, shadow_r.height);

      shadow_r_context.beginPath();
      shadow_r_context.moveTo(x0, y0);

shadow_r_context.bezierCurveTo(x0+(x2-x0)*2/7,y1-(y0-browy)/20,x1,y1-(y0-browy)/6,x2+(x2-x0)/5,y2-(y0-browy)/20);
shadow_r_context.bezierCurveTo(x3,y3+(y0-browy)/8,x3,y3+(y0-browy)/50,x0,y0);
shadow_r_context.bezierCurveTo(x3,y3+(y0-browy)/100,x3,y3+(y0-browy)/100,x2,y2);
shadow_r_context.bezierCurveTo(x1,y1-(y0-browy)/16,x1,y1-(y0-browy)/16,x0,y0);

      shadow_r_context.closePath();
      shadow_r_context.lineWidth = 0;
      shadow_r_context.fillStyle = "rgba("+r+","+g+","+b+","+op+")";
      shadow_r_context.fill();
}

function left_liner_draw(canv,x0,y0,x1,y1,x2,y2,x3,y3,browy,r,g,b,op)
{
      var shadow_l = document.getElementById(canv);
      var shadow_l_context = shadow_l.getContext('2d');

//      shadow_l_context.clearRect(0, 0, shadow_l.width, shadow_l.height);

      shadow_l_context.beginPath();
      shadow_l_context.moveTo(x2, y2);

shadow_l_context.bezierCurveTo(x2-(x2-x0)*2/7,y1-(y2-browy)/20,x1,y1-(y2-browy)/6,x0-(x2-x0)/5,y0-(y2-browy)/20);
shadow_l_context.bezierCurveTo(x3,y3+(y2-browy)/8,x3,y3+(y2-browy)/50,x2,y2);
shadow_l_context.bezierCurveTo(x3,y3+(y2-browy)/100,x3,y3+(y2-browy)/100,x0,y0);
shadow_l_context.bezierCurveTo(x1,y1-(y2-browy)/16,x1,y1-(y2-browy)/16,x2,y2);

      shadow_l_context.closePath();
      shadow_l_context.lineWidth = 0;
      shadow_l_context.fillStyle = "rgba("+r+","+g+","+b+","+op+")";
      shadow_l_context.fill();
}



function lips_draw(outerlipArray,innerlipArray,or,og,ob,op ) {
//adjust RGB based on brightness
  var r=Math.round(or/6);
  var g=Math.round(og/6);
  var b=Math.round(ob/6);

  if(outerlipArray.length==0) {
    console.log('Error: outerlip length is 0');
    return;
  }

  if(innerlipArray.length==0) {
    console.log('Error: innerlip length is 0');
    return;
  }

  var minx=-1,maxx=-1;
  var miny=-1,maxy=-1;
  for(var i=0,l=outerlipArray.length;i<l;i++) {
    if(minx==-1) {
      minx=outerlipArray[i].x;
    } else {
      if(minx>outerlipArray[i].x) {
        minx=outerlipArray[i].x;
      }
    }

    if(maxx==-1) {
      maxx=outerlipArray[i].x;
    } else {
      if(maxx<outerlipArray[i].x) {
        maxx=outerlipArray[i].x;
      }
    }


    if(miny==-1) {
      miny=outerlipArray[i].y;
    } else {
      if(miny>outerlipArray[i].y) {
        miny=outerlipArray[i].y;
      }
    }

    if(maxy==-1) {
      maxy=outerlipArray[i].y;
    } else {
      if(maxy<outerlipArray[i].y) {
        maxy=outerlipArray[i].y;
      }
    }
  }

  if(miny>maxy) {
    console.log('Error: something wrong with lip coords');
    return;
  }

  var outerh=maxy-miny;

  var lipbox=[minx,miny,maxx,maxy];


  miny=-1;
  maxy=-1;
  for(var i=0,l=innerlipArray.length;i<l;i++) {
    if(miny==-1) {
      miny=innerlipArray[i].y;
    } else {
      if(miny>innerlipArray[i].y) {
        miny=innerlipArray[i].y;
      }
    }

    if(maxy==-1) {
      maxy=innerlipArray[i].y;
    } else {
      if(maxy<innerlipArray[i].y) {
        maxy=innerlipArray[i].y;
      }
    }
  }

  if(miny>maxy) {
    console.log('Error: something wrong with lip coords');
    return;
  }

  var innerh=maxy-miny;

  var lip_open_ratio=0.21;

  if(innerh>outerh*lip_open_ratio) {
    //Lips opened
    var lips_opened=1;
  } else {
    //Lips closed
    var lips_opened=0;
  }




  var lipw=lipbox[2]-lipbox[0];
  var liph=lipbox[3]-lipbox[1];

  var blurradius=Math.round(lipw*0.05);

  var bluroff=blurradius*2;
  var newx0=Math.max(0,lipbox[0]-bluroff);
  var newy0=Math.max(0,lipbox[1]-bluroff);
  var newx1=Math.min(canvas.width-1,lipbox[2]+bluroff);
  var newy1=Math.min(canvas.height-1,lipbox[3]+bluroff);

  var blurw=newx1-newx0;
  var blurh=newy1-newy0;


  canvas_draw.width=blurw;
  canvas_draw.height=blurh;

  context_draw.clearRect(0, 0, blurw, blurh);


  var curvelevel=0.36;

  // draw outer lips
  var rmi=6;
  context_draw.beginPath();

  context_draw.moveTo(outerlipArray[0].x-newx0,outerlipArray[0].y-newy0);
  for(var i=0,l=outerlipArray.length;i<l;i++) {
    var bh0=(i-1+l)%l;
    var p0=i;
    var p1=(i+1)%l;
    var bh1=(i+2)%l;

    var bh0pos=[outerlipArray[bh0].x-newx0,outerlipArray[bh0].y-newy0];
    var p0pos=[outerlipArray[p0].x-newx0,outerlipArray[p0].y-newy0];
    var p1pos=[outerlipArray[p1].x-newx0,outerlipArray[p1].y-newy0];
    var bh1pos=[outerlipArray[bh1].x-newx0,outerlipArray[bh1].y-newy0];

    var l0_dist=Math.sqrt((p1pos[0]-bh0pos[0])*(p1pos[0]-bh0pos[0])+(p1pos[1]-bh0pos[1])*(p1pos[1]-bh0pos[1]));
    var l0_xu=(p1pos[0]-bh0pos[0])/l0_dist;
    var l0_yu=(p1pos[1]-bh0pos[1])/l0_dist;

    var l1_dist=Math.sqrt((p0pos[0]-bh1pos[0])*(p0pos[0]-bh1pos[0])+(p0pos[1]-bh1pos[1])*(p0pos[1]-bh1pos[1]));
    var l1_xu=(p0pos[0]-bh1pos[0])/l1_dist;
    var l1_yu=(p0pos[1]-bh1pos[1])/l1_dist;

    var mydist=Math.sqrt((p0pos[0]-p1pos[0])*(p0pos[0]-p1pos[0])+(p0pos[1]-p1pos[1])*(p0pos[1]-p1pos[1]))*curvelevel;

    if(i==0 || i==rmi) {
      var b0pos=[p0pos[0],p0pos[1]];
    } else {
      var b0pos=[p0pos[0]+mydist*l0_xu,p0pos[1]+mydist*l0_yu];
    }

    if(i==rmi-1 || i==l-1) {
      var b1pos=[p1pos[0],p1pos[1]];
    } else {
      var b1pos=[p1pos[0]+mydist*l1_xu,p1pos[1]+mydist*l1_yu];
    }

    context_draw.bezierCurveTo(b0pos[0], b0pos[1], b1pos[0], b1pos[1], p1pos[0], p1pos[1]);
  }


  if(lips_opened==1) {
    //draw inner lips
    var curvelevel=0.36;
    var rmi=4;
    var l=innerlipArray.length;

    context_draw.moveTo(innerlipArray[l-1].x-newx0,innerlipArray[l-1].y-newy0);

    for(var i=l-1;i>=0;i--) {
      var bh0=(i+1)%l;
      var p0=i;
      var p1=(i-1+l)%l;
      var bh1=(i-2+l)%l;

      var bh0pos=[innerlipArray[bh0].x-newx0,innerlipArray[bh0].y-newy0];
      var p0pos=[innerlipArray[p0].x-newx0,innerlipArray[p0].y-newy0];
      var p1pos=[innerlipArray[p1].x-newx0,innerlipArray[p1].y-newy0];
      var bh1pos=[innerlipArray[bh1].x-newx0,innerlipArray[bh1].y-newy0];

      var l0_dist=Math.sqrt((p1pos[0]-bh0pos[0])*(p1pos[0]-bh0pos[0])+(p1pos[1]-bh0pos[1])*(p1pos[1]-bh0pos[1]));
      var l0_xu=(p1pos[0]-bh0pos[0])/l0_dist;
      var l0_yu=(p1pos[1]-bh0pos[1])/l0_dist;

      var l1_dist=Math.sqrt((p0pos[0]-bh1pos[0])*(p0pos[0]-bh1pos[0])+(p0pos[1]-bh1pos[1])*(p0pos[1]-bh1pos[1]));
      var l1_xu=(p0pos[0]-bh1pos[0])/l1_dist;
      var l1_yu=(p0pos[1]-bh1pos[1])/l1_dist;

      var mydist=Math.sqrt((p0pos[0]-p1pos[0])*(p0pos[0]-p1pos[0])+(p0pos[1]-p1pos[1])*(p0pos[1]-p1pos[1]))*curvelevel;

      if(i==0 || i==rmi) {
        var b0pos=[p0pos[0],p0pos[1]];
      } else {
        var b0pos=[p0pos[0]+mydist*l0_xu,p0pos[1]+mydist*l0_yu];
      }

      if(i==rmi+1 || i==1) {
        var b1pos=[p1pos[0],p1pos[1]];
      } else {
        var b1pos=[p1pos[0]+mydist*l1_xu,p1pos[1]+mydist*l1_yu];
      }

      context_draw.bezierCurveTo(b0pos[0], b0pos[1], b1pos[0], b1pos[1], p1pos[0], p1pos[1]);
    }
  }

  context_draw.closePath();

  context_draw.fillStyle = 'rgba('+r+','+g+','+b+','+op+')';
  context_draw.fill();


  boxBlurCanvasRGBA('canvas_draw', 0, 0, blurw, blurh, blurradius, 1);
//  stackBlurCanvasRGBA('canvas_draw', 0, 0, blurw, blurh, blurradius);
//  integralBlurCanvasRGBA( 'canvas_draw', 0, 0, blurw, blurh, blurradius, 1);
//  stackBoxBlurCanvasRGBA('canvas_draw', 0, 0, blurw, blurh, blurradius,1);

  context.drawImage(canvas_draw,newx0,newy0);
}

window['render']=render;
