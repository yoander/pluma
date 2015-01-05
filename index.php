<?php

if ('Windows NT' === PHP_OS || 'WINNT' === PHP_OS) { // Windows
    define('DOC_ROOT', str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT']));
} else { // Unix
    define('DOC_ROOT', $_SERVER['DOCUMENT_ROOT']);
}

define('PROTOCOL', empty($_SERVER['HTTPS']) ? 'http://' : 'https://');
define('BASE_DIR', str_ireplace(DOC_ROOT, '', __DIR__));
define('BASE_URL',  PROTOCOL . $_SERVER['HTTP_HOST'] . BASE_DIR);
define('DB_DIR', __DIR__ . '/db');
define('VENDOR_DIR', __DIR__ . '/vendor');

require_once VENDOR_DIR . '/tree/bootstrap.php';

use Tree\Helper\Render;
use Tree\Helper\Output;
use Tree\Helper\Writer;

if (!empty($_REQUEST['save']) && (bool) $_REQUEST['save']) {
    Writer::write($_REQUEST['slug'], $_REQUEST['content']);
    echo 'Ok';
    return;
}

$slug = empty($_REQUEST['slug']) ? str_replace([BASE_DIR, '/'], '', $_SERVER['REQUEST_URI']) : $_REQUEST['slug'];

$output = Render::output(DB_DIR, $slug);

if (!empty($slug)) {
    $html = null;
    $raw = null;
    if (Output::TYPE_CONTENT === $output->getType()) {
        switch (strtolower($output->getContentType())) {
            case 'textile':
                // Register textile namespace
                $loader->addNamespace('Netcarver\Textile', __DIR__ . '/vendor/netcarver/textile/src/Netcarver/Textile');
                $parser = new \Netcarver\Textile\Parser();
                $raw = $output->getContent();
                $html = html_entity_decode($parser->textileThis($raw));
                break;
            case 'txt':
                $raw = $output->getContent();
                $html = "<pre>{$raw}</pre>";
                break;
            default:
                $raw = $output->getContent();
                $html = $raw;
        }
    }
    echo json_encode(['tree' => $output->getTree(), 'html' => $html, 'raw' => $output->getContent()]);
    return;
} else {
?>
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Tree</title>
            <link href="css/vendor/bootstrap.min.css" rel="stylesheet">
            <link href="css/main.css" rel="stylesheet">
        </head>
        <body style="padding-top: 70px" data-url="<?php echo BASE_URL ?>">
            <div role="navigation" class="navbar navbar-inverse navbar-fixed-top">
                <div class="container">
                    <div class="navbar-header">
                        <a href="<?php echo '' ?>" class="navbar-brand"><span class="glyphicon glyphicon-leaf"></span> leaf: Personal and beautiful wiki</a>
                    </div>
                    <div class="navbar-collapse collapse">
                        <ul class="nav navbar-nav navbar-right">
                            <li>

                                <form class="navbar-form navbar-left" role="search" method="post" action="<?php echo '' ?>/send.php">
                                    <div id="toolbar">
                                        <button id="edit-src" data-ref="" role="button" class="btn btn-sm btn-danger "><span class="glyphicon glyphicon-pencil"></span> Edit</button>
                                        <button id="save-src" data-ref="" role="button" class="btn btn-sm btn-success"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button>
                                        <button id="view-html" data-ref="" role="button" class="btn btn-sm btn-primary active"><span class="glyphicon glyphicon-eye-open"></span> View</button>
                                    </div>
                                </form>
                            </li>
                        </ul>
                    </div><!--/.nav-collapse -->
            </div>
        </div>
            <div class="container">
                <div class="row">
                    <div id="tree-container" style="float: left; width: 20%"><?php echo $output->getTree() ?></div>
                    <div id="content-container" style="float: left; width: 80%">
                        <textarea id="editor" style="display: none"></textarea>
                        <div id="content" ><?php echo $output->getContent() ?></div>
                    </div>
                </div>
            </div>
            <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
            <script src="js/vendor/jquery.js"></script>
            <script src="js/vendor/amplify.store.min.js"></script>
            <!-- Include all compiled plugins (below), or include individual files as needed -->
            <script src="js/main-nonrecursive.js"></script>
        </body>
    </html>
<?php } ?>
