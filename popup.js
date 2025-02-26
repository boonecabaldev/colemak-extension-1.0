<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=400, height=500, initial-scale=1.0">
    <title>Text Area with Colemak Layout</title>
    
    <!-- MDB CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/6.4.0/mdb.min.css" rel="stylesheet" />

    <style>
        html, body {
            margin: 0;
            padding: 0;
            width: 400px;
            height: 500px;
            box-sizing: border-box;
            background: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .container {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            padding: 1rem;
            background: #fff;
            border-radius: 0;
            box-shadow: none;
        }

        h1 {
            font-size: 1.5rem;
            font-weight: bold;
            color: #333;
            text-align: center;
        }

        textarea {
            flex-grow: 1;
            resize: none;
            width: 100%;
            border: 2px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            font-size: 1rem;
            transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }

        textarea:focus {
            border-color: #007bff;
            outline: none;
            box-shadow: 0 0 8px rgba(0, 123, 255, 0.7);
        }

        .btn {
            transition: all 0.3s ease-in-out;
            border-radius: 8px;
            outline: none;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .btn:focus {
            outline: 3px solid rgba(0, 123, 255, 0.5);
            box-shadow: 0 0 8px rgba(0, 123, 255, 0.7);
        }

        .message {
            display: none;
            font-size: 1rem;
            font-weight: bold;
            transition: opacity 0.5s ease-in-out;
            text-align: center;
            margin-top: 10px;
            color: green;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1 class="mb-3">Colemak Text Area</h1>
        <textarea id="colemakTextArea" class="form-control mb-3" autofocus tabindex="1"></textarea>
        
        <div class="d-flex justify-content-center gap-2">
            <button id="saveButton" class="btn btn-primary" tabindex="2">Save</button>
            <button id="copyButton" class="btn btn-success" tabindex="3">Copy</button>
            <button id="copyAndClearButton" class="btn btn-outline-info" tabindex="4">Copy & Clear</button>
        </div>
        
        <div id="message" class="message">Content copied!</div>
    </div>

    <!-- MDB JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/6.4.0/mdb.min.js"></script>
    <script src="popup.js"></script>
</body>

</html>
