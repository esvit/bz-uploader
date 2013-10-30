<?php

namespace tests;

use Bazalt\Uploader;

class UploaderTest extends \tests\BaseCase
{
    /**
     * @var \Bazalt\Uploader\Base
     */
    protected $uploader;

    protected function setUp()
    {
        $_FILES = array(
            'file' => array(
                'name' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '_files' . DIRECTORY_SEPARATOR . 'test.txt',
                'type' => 'plain/text',
                'size' => 8,
                'tmp_name' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '_files' . DIRECTORY_SEPARATOR . 'test.txt',
                'error' => 0
            )
        );
        $this->uploader = new \Bazalt\Uploader\Base(['txt'], 1000000);
    }

    protected function tearDown()
    {
    }

    public function testSizeLimit()
    {
        $this->assertEquals(1000000, $this->uploader->sizeLimit());

        $this->uploader->sizeLimit(100);

        $this->assertEquals(100, $this->uploader->sizeLimit());
    }

    public function testHandleUpload()
    {
        $result = $this->uploader->handleUpload(__DIR__ . DIRECTORY_SEPARATOR . '_uploads');

        $this->assertEquals(dirname(__FILE__) . DIRECTORY_SEPARATOR . '_files' . DIRECTORY_SEPARATOR . 'test.txt', $result['name']);
        $this->assertEquals('testfile', file_get_contents($result['file']));
    }
}