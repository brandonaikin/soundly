<?php namespace App\Controllers;
//ini_set('display_errors', 1);
class Home extends SoundlyBaseController {
  
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

  public function sounds() {
		$id = $this->request->getVar('id');
		if(empty($id)){
			return redirect()->to("/public/login");
		}
		$file    = dirname($_SERVER["SCRIPT_FILENAME"]);
		$path    = str_replace("public", "writable", $file);
		$path .= "/uploads/soundly/$id/samples/";
		$data = $this->_findFiles($path);
		$count = count($data);
		$replacements = array();
		for($i = 0; $i < $count; $i++){
			$item = $data[$i];
			if(is_array($item)){
				//echo "item is array. \n";
				$replacements = [$i => $item[0]];
			}
			elseif(is_string($item) && strlen($item) < 4) {
				//echo "item is string. \n";
				$replacements = [$i => $data[$i]];
			}
		}
		//print_r($replacements);
		//echo "\n";
		//$data = array_replace($data,$replacements);
		//print_r($data);
		//echo "\n";
		$json = json_encode($data);
		return $this->response->setJSON($json);
	}
}
