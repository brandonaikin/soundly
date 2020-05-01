<?php


	namespace App\Controllers;


	class Sounds extends SoundlyBaseController {
		public function index() {
			$id = $this->request->getVar('id');
			if(empty($id)){
				return redirect()->to("/public/login");
			}

			$file    = dirname($_SERVER["SCRIPT_FILENAME"]);
			$path    = str_replace("public", "writable", $file);
			$path .= "/uploads/soundly/$id/samples";
			$data = $this->_findFiles($path);
			echo "data: " . $data . "\n";
			$json = json_encode($data);
			return $this->response->setJSON($json);
		}
	}