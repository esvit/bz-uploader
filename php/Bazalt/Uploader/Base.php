<?php

namespace Bazalt\Uploader;

define('DEFAULT_MAX_SIZE', 10485760);

class Base
{
    private $allowedExtensions = array();

    private $sizeLimit = DEFAULT_MAX_SIZE;

    /**
     * @var Ajax
     */
    private $file;

    public function __construct(array $allowedExtensions = array(), $sizeLimit = DEFAULT_MAX_SIZE)
    {
        $allowedExtensions = array_map("strtolower", $allowedExtensions);

        $this->allowedExtensions = $allowedExtensions;
        $this->sizeLimit = $sizeLimit;

        if (isset($_GET['files'])) {
            $this->file = new Ajax();
        } elseif (isset($_FILES['file'])) {
            $this->file = new Form();
        } else {
            $this->file = false;
        }
    }

    public function sizeLimit($sizeLimit = null)
    {
        if ($sizeLimit !== null) {
            $this->sizeLimit = $sizeLimit;
            return $this;
        }
        return $this->sizeLimit;
    }

    public function getFolder($filename)
    {
        return $filename[0] . $filename[1] .
                DIRECTORY_SEPARATOR . $filename[2] . $filename[3] .
                DIRECTORY_SEPARATOR . $filename;
    }

    /**
     * Returns array('success'=>true) or array('error'=>'error message')
     */
    public function handleUpload($uploadDirectory, \Closure $folderCallback = null)
    {
        if (!$folderCallback) {
            $folderCallback = array($this, 'getFolder');
        }

        if (!is_writable($uploadDirectory)){
            throw new Exception\Upload('Server error. Upload directory isn\'t writable');
        }

        if (!$this->file){
            throw new Exception\Upload('No files were uploaded');
        }

        $size = $this->file->getSize();

        if ($size == 0) {
            throw new Exception\Upload('File is empty');
        }

        if ($size > $this->sizeLimit) {
            throw new Exception\Upload('File is too large');
        }

        $pathinfo = pathinfo($this->file->getName());

        $filename = md5(uniqid());
        $ext = $pathinfo['extension'];

        if($this->allowedExtensions && !in_array(strtolower($ext), $this->allowedExtensions)){
            $these = implode(', ', $this->allowedExtensions);
            throw new Exception\Upload('File has an invalid extension, it should be one of '. $these);
        }

        $fullname = $uploadDirectory . DIRECTORY_SEPARATOR . $folderCallback($filename . '.' . $ext);
        mkdir(dirname($fullname), 0777, true);

        $this->file->save($fullname);

        return array(
            'name' => $this->file->getName(),
            'file' => $fullname
        );
    }
}