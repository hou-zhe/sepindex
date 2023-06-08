
let accessid = "";
let accesskey = "";
let host = "https://sep-users.oss-cn-beijing.aliyuncs.com";
let policyBase64 = "";
let signature = "";
let callbackbody = "";
let filename = "";
let key = "";
let expire = 0;
let g_object_name = "";
let g_object_name_type = "";
let now = Date.parse(new Date()) / 1000;
let timestamp = Date.parse(new Date()) / 1000;

function send_request(type) {
  let xmlhttp = null;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  if (xmlhttp != null) {
   // let checkoauth =  JSON.parse( sessionStorage.getItem('checkoauth'))
  //  let checkoauth ={}
  //  checkoauth.unionid = 'oyrWm0xKX9eKErL6nCxIHSwsX7jw'
  //  checkoauth.token = 'T75f2b2a44f7b7526674ce393b4ab9828b3f6215d'
    console.log('config.url',process.env.VUE_APP_BASE_API);
    let url = process.env.VUE_APP_BASE_API
    let serverUrl = url + "/api/cashier/oss/getpolicytoken?type=13";

    xmlhttp.open("GET", serverUrl, false);
    xmlhttp.send(null);
    console.log(JSON.parse(xmlhttp.response).result)
    return JSON.parse(xmlhttp.response).result;
  } else {
    alert("Your browser does not support XMLHTTP.");
  }
}

function get_signature(type) {
  now = timestamp = Date.parse(new Date()) / 1000;
  if (expire < now + 3) {
    let body = send_request(type);

    console.log(body);
    host = body.host;
    policyBase64 = body.policy;
    accessid = body.accessid;
    signature = body.signature;
    expire = parseInt(body.expire);
    callbackbody = '';
    key = body.dir;
    return true;
  }
  return false;
}

function random_string(len) {
  len = len || 32;
  var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  var maxPos = chars.length;
  var pwd = "";
  for (var i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
function check_object_radio() {
    g_object_name_type = 'random_name';
}

function get_suffix(filename) {
  let pos = filename.lastIndexOf(".");
  let suffix = "";
  if (pos != -1) {
    suffix = filename.substring(pos);
  }
  return suffix;
}

function calculate_object_name(filename) {
  if (g_object_name_type == "local_name") {
    g_object_name += "${filename}";
  } else if (g_object_name_type == "random_name") {
    let suffix = get_suffix(filename);
    g_object_name = key + random_string(10) + suffix;
  }
  return "";
}
function get_uploaded_object_name(filename){
    if (g_object_name_type == 'local_name')
    {
        tmp_name = g_object_name
        tmp_name = tmp_name.replace("${filename}", filename);
        return tmp_name
    }
    else if(g_object_name_type == 'random_name')
    {
        return g_object_name
    }
}

function set_upload_param(up, filename, ret, type) {
  console.log(up, filename, ret,type)
  if (ret == false) {
    console.log('重新获取签名对象')
    ret = get_signature(type);
  }
  g_object_name = key;
  if (filename != "") {
    console.log(calculate_object_name(filename))
    let suffix = get_suffix(filename);
    console.log(suffix)
    calculate_object_name(filename);
  }
  let new_multipart_params = {
    key: g_object_name,
    policy: policyBase64,
    OSSAccessKeyId: accessid,
    success_action_status: "200", //让服务端返回200,不然，默认会返回204
    callback: callbackbody,
    signature: signature
  };
  console.log(new_multipart_params)

  up.setOption({
    url: host,
    multipart_params: new_multipart_params
  });

  up.start();
}

export { set_upload_param, check_object_radio, get_uploaded_object_name }