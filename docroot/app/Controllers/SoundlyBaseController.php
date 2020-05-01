<?php


	namespace App\Controllers;


	class SoundlyBaseController extends BaseController{

		protected function _writeFile($path, $data, $pattern) {
			if(!is_dir($path)) {
				mkdir($path);
			}
			$filepath = "$path/{$pattern}.json";
			return file_put_contents ($filepath, $data);
		}

		protected function _findFiles($path) {
			$list = array();
			if ($handle = opendir($path)) {
				while (false !== ($entry = readdir($handle))) {
					$list[]= $entry;
				}
				closedir($handle);
			}
			return $list;
		}

		protected function _getFilesJsonArray($path) {
			$data = array();
			if(is_dir($path)) {
				$files = $this->_findFiles($path);
				foreach($files as $file) {

					$pattern = explode(".", $file)[0];
					$filepath = "$path/$file";
					$filepath = str_replace("//", "/", $filepath);

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

		protected function _getFilePaths($path) {

		}
	}