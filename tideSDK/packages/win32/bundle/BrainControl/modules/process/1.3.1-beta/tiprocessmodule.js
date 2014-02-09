/**
 * This file has been modified from its orginal sources.
 *
 * Copyright (c) 2012 Software in the Public Interest Inc (SPI)
 * Copyright (c) 2012 David Pratt
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 ***
 * Copyright (c) 2008-2012 Appcelerator Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
(function () {
  var CreateProcess = Ti.Process.createProcess;

  Ti.Process.createProcess = function () {
    var process = CreateProcess.apply(Ti.Process, arguments);

    /**
     * @tiapi(method=True,name=Process.Process.setOnReadLine,since=0.5)
     * @tiarg[Function, fn] a callback that is called with every line of output received from this process
     */
    process.setOnReadLine = function (fn) {
      process.buffer = '';
      process.setOnRead(function (event) {
        var str = event.data.toString();
        if (process.buffer.length > 0) {
          str = process.buffer + str;
          process.buffer = '';
        }

        var lines = str.split(/\r?\n/);
        var lastLine = lines[lines.length - 1];

        if (str.indexOf(lastLine) + lastLine.length < str.length) {
          process.buffer = lines.pop();
        }

        for (var i = 0; i < lines.length; i++) {
          fn.apply(fn, [lines[i]]);
        }
      });

      process.addEventListener("exit", function (event) {
        if (process.buffer.length > 0) {
          fn(process.buffer);
          process.buffer = null;
        }
      });
    };

    return process;
  };

  /**
   * @tiapi(method=True,name=Process.launch,since=0.2,deprecated=True)
   * @tiapi This method is deprecated. See Process.Process.createProcess()
   * @tiarg[String, command] The command to launch
   * @tiarg[Array<String>, arguments] A list of arguments to the command
   */
  Ti.Process.launch = function (cmd, args) {
    Ti.API.warn("Ti.Process.launch is deprecated, please use Ti.Process.createProcess instead");

    if (!args) args = [];
    args.unshift(cmd);

    var process = CreateProcess.call(Ti.Process, args);
    var buffer = '';
    var onRead = null;
    var onExit = null;
    process.setOnRead(function (event) {
      if (!onRead) {
        buffer += event.data.toString();
      } else {
        if (buffer.length > 0) {
          onRead(buffer);
          buffer = '';
        } else {
          onRead(event.data.toString());
        }
      }
    });
    process.setOnExit(function (event) {
      if (onExit) onExit(process.getExitCode());
    });

    // wrap so that we can proxy the underlying Process object methods
    var processWrapper = {
      set onread(fn) {
        onRead = fn;
      },

      set onexit(fn) {
        onExit = fn;
      },

      terminate: function () {
        process.terminate();
      },
      isRunning: function () {
        return process.isRunning();
      }
    };

    process.launch();
    return processWrapper;
  };
})();
