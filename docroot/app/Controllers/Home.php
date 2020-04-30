<?php namespace App\Controllers;
ini_set('display_errors', 1);
class Home extends BaseController {
  
	public function index(){
    $id      = $this->request->getVar('id');
    if(empty($id)){
      return redirect()->to("/public/login");
    }
    $data    = $this->request->getJSON();
    
    $title = $this->request->getVar('title');//$values["title"];//
    $file    = dirname($_SERVER["SCRIPT_FILENAME"]);
    $path    = str_replace("public", "writable", $file);
    $success = TRUE;
    $path .= "/uploads/soundly/";
    if(!is_dir($path)) {
      mkdir($path);
    }
    if(is_dir($path) && !empty($id)) {
      try{
        $path .=  "$id/";
        
        $success = $this->_writeFile($path, json_encode($data), $title);
      }
      catch(Exception $e) {
        return $e->getMessage();
      }
    }
    $obj = array(
      "data" => $data,
      "title"=>$title
    );
    if(!$success) {
      $obj["message"] = "There was a problem writing to $path. $success";
    }
    $json = json_encode($obj);
		return $this->response->setJSON($json);
    
	}

  public function patterns() {
    $id   = $this->request->getVar('id');
    $file = dirname($_SERVER["SCRIPT_FILENAME"]);
    $path = str_replace("public", "writable", $file) . "/uploads/soundly/$id";
    $data = $this->_getFilesJsonArray($path);
    $json = json_encode($data);
		return $this->response->setJSON($json);
  }
  
  public function sequencer() {
    $id   = $this->request->getVar('id');
    $file = dirname($_SERVER["SCRIPT_FILENAME"]);
    $path = str_replace("public", "writable", $file) 
      . "/uploads/soundly/$id";
    $data = $this->_getFilesJsonArray($path);
    return view("sequencer", array("data" => $data));
  }
  
  public function synth() {
    return view("synth");
  }
  
  private function _getFilesJsonArray($path) {
    $data = array();
    if(is_dir($path)) {
      $files = $this->_findFiles($path);
      foreach($files as $file) {
        $pattern = explode(".", $file)[0];
        $filepath = "$path/$file";
        if(!is_file($filepath)) {
          
          continue;
        }
        $contents = file_get_contents($filepath);
        if(is_string($contents)){
          $value = json_decode($contents, true);
          if (empty($value["title"])) continue;
          if (empty($value["pattern"])) {
            $value["pattern"] = uniqid();
          }
          $data[]= $value;
        }
      }
    }
    return $data;
  }
  
  private function _writeFile($path, $data, $pattern) {
     if(!is_dir($path)) {
       mkdir($path);
     }
     $filepath = "$path/{$pattern}.json";
     return file_put_contents ($filepath, $data);
  }
  
  private function _findFiles($path) {
    $list = array();
    if ($handle = opendir($path)) {
        while (false !== ($entry = readdir($handle))) {
            $list[]= $entry;
        }
    closedir($handle);
    }
    return $list;
  }

}
