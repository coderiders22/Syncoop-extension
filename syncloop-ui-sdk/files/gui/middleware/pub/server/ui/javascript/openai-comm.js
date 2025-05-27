
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("chat-input").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById('chat-submit').click();
        }
    });
    document.getElementById("chat-submit").addEventListener("click", function (event) {
        event.preventDefault();
        sendMessage();
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 200);
    });

    const reply = '<strong>Complete your setup.</strong> <br> For instructions on how to setup smart feature <a style=\'color:#175cff; text-decoration:underline;\' href=\'https://docs.syncloop.com/docs/syncloopgpt/setup_gpt_token\'>click here</a>';

    function sendMessage() {
        var inputField = document.getElementById("chat-input");
        var message = inputField.value;
        if (message.trim() !== "") {
            updateChatLog("You", message);
            showWaitingGif();

            scrollToEnd(document.querySelector(".chat-logs"));

            /*let timeoutOccurred = false;

            let timeoutHandle = setTimeout(() => {
                hideWaitingGif();
                swal("Error Occurred", "Please check your network connection. The request timed out.", "error");
                timeoutOccurred = true;
            }, 90000); // Set timeout for 90 seconds*/

            const assistantID = ASSISTANT_ID;

            if (assistantID == "") {
                updateChatLog("Bot", "Add your JDBC configurations");
                hideWaitingGif();
                $("#chat-input").val('');
                return ;
            }

            sendMessageToThread(message, assistantID, false).then(response => {
                /*clearTimeout(timeoutHandle);

                if (timeoutOccurred) {
                    return;  // Exit if a timeout has occurred
                }*/

                if ("null" == response.thread_id) {
                    hideWaitingGif();
                    updateChatLog("Bot", "Error in communication.");
                    return ;
                }

                if (null != response.response && response.response === "NO_TOKEN") {
                    if(reply.trim() !== "") {
                        updateChatLog("Bot", reply);
                    }
                    hideWaitingGif();
                } else {
                    //
                    console.log(response);
                    eventStream("/v1/" + response.thread_id + "/run_stream?serviceType=" + SERVICE_TYPE + "&assistant_id=" + ASSISTANT_ID, function() {
                        hideWaitingGif();
                        updateChatLog("Bot", "In progress...");
                    }, function (errorMsg) {
                        hideWaitingGif();
                        if(errorMsg.trim() !== ""){
                            updateChatLog("Bot", errorMsg);
                        }
                    }, function (response) {
                        collectFinalResponse(response);
                    }, function (bytes) {
                        console.log(bytes);
                    }, response.thread_id);
                }

            }).catch(error => {
                //clearTimeout(timeoutHandle);
                updateChatLog("Bot", "Sorry, there was an error processing your request.");
                //console.error("Error fetching response:", error);
                hideWaitingGif();
            });
            inputField.value = ""; // Clear input after sending
        }
    }

    function collectFinalResponse(response) {
        try{
            if (SERVICE_TYPE == "API") {
                let extractedJson = "";
                let responseWithoutJson = response[0].replace(/```json[\s\S]*?```/g, '').trim();

                for (let i = 0 ; i < response.length ; i++) {
                    extractedJson += extractJsonFromResponse(response[i]);
                    responseWithoutJson += response[i].replace(/```json[\s\S]*?```/g, '').trim();
                }

                if(responseWithoutJson && responseWithoutJson.trim() !== "") {
                    updateChatLog("Bot", showdownConverter.makeHtml(responseWithoutJson));
                }
                hideWaitingGif();

                if (extractedJson) {
                    extractedJson = removeJSONComments(extractedJson);
                    if (typeof extractedJson === "string") {
                        extractedJson = JSON.parse(extractedJson);
                    }
                    console.log("Json --> ", extractedJson)
                    traverseAndModifyJson(extractedJson, loadFile);
                    if (extractedJson !== null) {
                        updateServiceUsingGPT(true, JSON.stringify(extractedJson));
                    }
                }
            } else if (SERVICE_TYPE == "SQL") {
                let JsonResponse = JSON.parse(removeJSONComments(response));
                if (JsonResponse.success) {
                    let serviceData = reformatSQLAIJson(JsonResponse);
                    loadSQLService(serviceData);
                    updateChatLog("Bot", "Updating the query in editor...");
                } else {
                    updateChatLog("Bot", "Input query has error or irrelevant. Please send query related from your database.");
                }
                hideWaitingGif();
            }
        } catch (error) {
            updateChatLog("Bot", "An error occurred while processing the response. Please try again.");
        }
    }


    function traverseAndModifyJson(jsonObj, filePath) {
        if (!filePath) {
            return;
        }

        if (Array.isArray(jsonObj)) {
            jsonObj.forEach(item => traverseAndModifyJson(item, filePath));
        } else if (typeof jsonObj === 'object' && jsonObj !== null) {
            Object.keys(jsonObj).forEach(key => {
                if (key === 'fqn' && jsonObj[key] === '##RECURSION##') {
                    //console.log('Replacing fqn at:', jsonObj);
                    jsonObj[key] = filePath.replace("files/", "").replace(".api", "");
                    //console.log('New fqn value:', jsonObj[key]);
                } else if (typeof jsonObj[key] === 'object') {
                    traverseAndModifyJson(jsonObj[key], filePath);
                }
            });
        }
    }


    function showWaitingGif() {
        if (!document.getElementById("waiting-gif")) {
            const chatLogs = document.querySelector(".chat-logs");
            const gifHtml = `
            <div class="messages-chat">
                <div class="message" id="waiting-gif" style="display: inline-flex;">
                    <div class="photo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                            <path d="M35.5 18C35.5 27.665 27.665 35.5 18 35.5C8.33502 35.5 0.5 27.665 0.5 18C0.5 8.33502 8.33502 0.5 18 0.5C27.665 0.5 35.5 8.33502 35.5 18Z" fill="#5BC083" stroke="#52AC76"></path>
                            <path d="M28.9695 19.1414C28.845 17.9737 28.3479 16.8751 27.55 16.0041C27.8 15.2634 27.8867 14.4787 27.8043 13.7024C27.7219 12.9261 27.4726 12.176 27.0727 11.5025C26.4799 10.4838 25.5744 9.67728 24.487 9.19923C23.3995 8.72133 22.1862 8.59651 21.0221 8.8431C20.497 8.25932 19.8518 7.79273 19.1292 7.47495C18.4065 7.15717 17.6235 6.99522 16.8324 7.00011C15.6423 6.99736 14.4821 7.36739 13.5188 8.05719C12.5555 8.747 11.8394 9.72082 11.4732 10.8381C10.6979 10.9947 9.96537 11.3128 9.32479 11.7714C8.68421 12.2299 8.15032 12.8183 7.75888 13.4968C7.1615 14.5128 6.90648 15.6895 7.03066 16.8578C7.15485 18.0258 7.65173 19.1249 8.44994 19.9964C8.20002 20.737 8.11331 21.5217 8.19553 22.298C8.27806 23.0743 8.52736 23.8243 8.92731 24.4979C9.52004 25.5166 10.4256 26.3231 11.5132 26.801C12.6005 27.2791 13.8138 27.4038 14.9779 27.1573C15.5029 27.7411 16.1482 28.2075 16.8708 28.5255C17.5933 28.8431 18.3762 29.0052 19.1673 29.0002C20.358 29.0032 21.519 28.6329 22.4824 27.9426C23.446 27.2525 24.1624 26.2781 24.5282 25.16C25.3035 25.0033 26.0359 24.6853 26.6764 24.2267C27.317 23.7682 27.8509 23.1798 28.2425 22.5012C28.8392 21.4854 29.0937 20.3088 28.9692 19.1411L28.9695 19.1414ZM22.3691 10.1653C23.162 10.1989 23.9288 10.4546 24.5799 10.9024C25.2308 11.3504 25.7392 11.9719 26.0455 12.6944C26.3516 13.4169 26.4428 14.2106 26.3085 14.9823C26.2757 14.9623 26.2181 14.928 26.1766 14.9047L21.737 12.3743C21.6264 12.3104 21.5006 12.277 21.3725 12.277C21.2445 12.277 21.1186 12.3106 21.0079 12.3743L15.5876 15.4623V13.3243C15.587 13.3133 15.589 13.3024 15.5938 13.2925C15.5985 13.2826 15.6055 13.2739 15.6144 13.2673L20.1023 10.7127C20.7897 10.3216 21.5761 10.1316 22.3689 10.1651L22.3691 10.1653ZM18.0008 15.2492L20.4148 16.6239V19.3745L18.0008 20.7494L15.5867 19.3745V16.6248L18.0008 15.2492ZM12.654 12.5592C12.6545 11.7759 12.8812 11.0089 13.3075 10.3481C13.7337 9.68721 14.3418 9.15996 15.0609 8.82767C15.78 8.49552 16.5799 8.37223 17.3672 8.47245C18.1548 8.57252 18.8969 8.89199 19.507 9.39326C19.4731 9.41144 19.4142 9.44352 19.3751 9.4669L14.9355 11.9972C14.8241 12.0597 14.7317 12.1503 14.6674 12.2599C14.6035 12.3694 14.5699 12.4936 14.5706 12.6201L14.5676 18.7937L12.6907 17.7245C12.6808 17.7198 12.6723 17.7124 12.6659 17.7037C12.6596 17.6949 12.6554 17.6845 12.6542 17.6738V12.559L12.654 12.5592ZM8.6088 17.3429C8.32219 16.2875 8.47131 15.1629 9.02362 14.2159C9.51106 13.3801 10.2811 12.7402 11.1987 12.4082C11.1987 12.446 11.1965 12.5127 11.1965 12.559V17.6196C11.1957 17.7461 11.229 17.8703 11.2931 17.9798C11.3571 18.0894 11.4497 18.18 11.5608 18.2424L16.9811 21.3301L15.1045 22.3993C15.0952 22.4052 15.0847 22.4089 15.0737 22.41C15.0626 22.4111 15.0516 22.4092 15.0412 22.4051L10.5528 19.846C9.59452 19.2985 8.89541 18.3983 8.6088 17.343V17.3429ZM12.7291 25.698C11.659 25.4152 10.7464 24.7249 10.1916 23.779C9.70198 22.9444 9.52546 21.9665 9.69316 21.0162C9.72614 21.0357 9.78374 21.0704 9.82508 21.0939L14.2647 23.6243C14.3752 23.6881 14.5011 23.7218 14.6293 23.7218C14.7575 23.7218 14.8833 23.6881 14.9938 23.6243L20.414 20.5363V22.6744C20.4147 22.6853 20.4125 22.6963 20.4078 22.7062C20.403 22.7162 20.3961 22.7249 20.3873 22.7313L15.8993 25.2881C14.9395 25.8335 13.7992 25.9811 12.7293 25.6983L12.7291 25.698ZM23.3438 23.4393C23.3422 24.5316 22.9022 25.579 22.1198 26.3517C21.3372 27.1246 20.2762 27.5599 19.1691 27.5622C18.1918 27.5636 17.2451 27.2259 16.4944 26.6081C16.5283 26.5901 16.5876 26.5578 16.6263 26.5344L21.0659 24.0041C21.1774 23.9415 21.2698 23.8509 21.3339 23.7412C21.3981 23.6316 21.4315 23.5073 21.4307 23.3809V17.2054L23.3072 18.2744C23.3172 18.2793 23.3255 18.2864 23.332 18.2953C23.3384 18.3042 23.3422 18.3144 23.3438 18.3253V23.4396V23.4393ZM27.5225 20.0731C27.4548 20.8538 27.1629 21.5992 26.6814 22.2221C26.1997 22.8451 25.5483 23.3198 24.8032 23.5907V18.3787C24.8042 18.2525 24.7713 18.1283 24.7075 18.0189C24.6438 17.9094 24.5519 17.8186 24.441 17.756L19.0208 14.668L20.8973 13.5993C20.9066 13.5932 20.9171 13.5895 20.9283 13.5886C20.9393 13.5875 20.9504 13.5894 20.9606 13.5936L25.449 16.1503C26.1367 16.5423 26.697 17.1192 27.0642 17.814C27.4314 18.5087 27.5905 19.2922 27.5228 20.0729L27.5225 20.0731Z" fill="white"></path>
                        </svg>
                    </div>
                    <p class="text">
                        <img src="/files/gui/middleware/pub/server/ui/icons/loading-animation.gif" alt="Loading..." style="width: 24px;" >
                    </p>
                </div>
            </div>`;
            chatLogs.insertAdjacentHTML('beforeend', gifHtml);
        } else {
            document.getElementById("waiting-gif").style.display = "inline-flex";
        }
    }

    function hideWaitingGif() {
        $("#waiting-gif").remove();
    }



    function updateChatLog(userLabel, text) {
        const chatLogs = document.querySelector(".chat-logs");
        const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

        let messageHtml = '';

        if (userLabel === "You") {
            messageHtml = `
              <div class="messages-chat">
                <div class="message text-only"> 
                    <div class="response">
                        <p class="text">${text}</p>
                    </div>
               </div>
               <p class="response-time time">${currentTime}</p> 
              </div>`;
        } else {
            messageHtml = `
               <div class="messages-chat">
                    <div class="message">
                        <div class="photo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                                <path d="M35.5 18C35.5 27.665 27.665 35.5 18 35.5C8.33502 35.5 0.5 27.665 0.5 18C0.5 8.33502 8.33502 0.5 18 0.5C27.665 0.5 35.5 8.33502 35.5 18Z" fill="#5BC083" stroke="#52AC76"/>
                                <path d="M28.9695 19.1414C28.845 17.9737 28.3479 16.8751 27.55 16.0041C27.8 15.2634 27.8867 14.4787 27.8043 13.7024C27.7219 12.9261 27.4726 12.176 27.0727 11.5025C26.4799 10.4838 25.5744 9.67728 24.487 9.19923C23.3995 8.72133 22.1862 8.59651 21.0221 8.8431C20.497 8.25932 19.8518 7.79273 19.1292 7.47495C18.4065 7.15717 17.6235 6.99522 16.8324 7.00011C15.6423 6.99736 14.4821 7.36739 13.5188 8.05719C12.5555 8.747 11.8394 9.72082 11.4732 10.8381C10.6979 10.9947 9.96537 11.3128 9.32479 11.7714C8.68421 12.2299 8.15032 12.8183 7.75888 13.4968C7.1615 14.5128 6.90648 15.6895 7.03066 16.8578C7.15485 18.0258 7.65173 19.1249 8.44994 19.9964C8.20002 20.737 8.11331 21.5217 8.19553 22.298C8.27806 23.0743 8.52736 23.8243 8.92731 24.4979C9.52004 25.5166 10.4256 26.3231 11.5132 26.801C12.6005 27.2791 13.8138 27.4038 14.9779 27.1573C15.5029 27.7411 16.1482 28.2075 16.8708 28.5255C17.5933 28.8431 18.3762 29.0052 19.1673 29.0002C20.358 29.0032 21.519 28.6329 22.4824 27.9426C23.446 27.2525 24.1624 26.2781 24.5282 25.16C25.3035 25.0033 26.0359 24.6853 26.6764 24.2267C27.317 23.7682 27.8509 23.1798 28.2425 22.5012C28.8392 21.4854 29.0937 20.3088 28.9692 19.1411L28.9695 19.1414ZM22.3691 10.1653C23.162 10.1989 23.9288 10.4546 24.5799 10.9024C25.2308 11.3504 25.7392 11.9719 26.0455 12.6944C26.3516 13.4169 26.4428 14.2106 26.3085 14.9823C26.2757 14.9623 26.2181 14.928 26.1766 14.9047L21.737 12.3743C21.6264 12.3104 21.5006 12.277 21.3725 12.277C21.2445 12.277 21.1186 12.3106 21.0079 12.3743L15.5876 15.4623V13.3243C15.587 13.3133 15.589 13.3024 15.5938 13.2925C15.5985 13.2826 15.6055 13.2739 15.6144 13.2673L20.1023 10.7127C20.7897 10.3216 21.5761 10.1316 22.3689 10.1651L22.3691 10.1653ZM18.0008 15.2492L20.4148 16.6239V19.3745L18.0008 20.7494L15.5867 19.3745V16.6248L18.0008 15.2492ZM12.654 12.5592C12.6545 11.7759 12.8812 11.0089 13.3075 10.3481C13.7337 9.68721 14.3418 9.15996 15.0609 8.82767C15.78 8.49552 16.5799 8.37223 17.3672 8.47245C18.1548 8.57252 18.8969 8.89199 19.507 9.39326C19.4731 9.41144 19.4142 9.44352 19.3751 9.4669L14.9355 11.9972C14.8241 12.0597 14.7317 12.1503 14.6674 12.2599C14.6035 12.3694 14.5699 12.4936 14.5706 12.6201L14.5676 18.7937L12.6907 17.7245C12.6808 17.7198 12.6723 17.7124 12.6659 17.7037C12.6596 17.6949 12.6554 17.6845 12.6542 17.6738V12.559L12.654 12.5592ZM8.6088 17.3429C8.32219 16.2875 8.47131 15.1629 9.02362 14.2159C9.51106 13.3801 10.2811 12.7402 11.1987 12.4082C11.1987 12.446 11.1965 12.5127 11.1965 12.559V17.6196C11.1957 17.7461 11.229 17.8703 11.2931 17.9798C11.3571 18.0894 11.4497 18.18 11.5608 18.2424L16.9811 21.3301L15.1045 22.3993C15.0952 22.4052 15.0847 22.4089 15.0737 22.41C15.0626 22.4111 15.0516 22.4092 15.0412 22.4051L10.5528 19.846C9.59452 19.2985 8.89541 18.3983 8.6088 17.343V17.3429ZM12.7291 25.698C11.659 25.4152 10.7464 24.7249 10.1916 23.779C9.70198 22.9444 9.52546 21.9665 9.69316 21.0162C9.72614 21.0357 9.78374 21.0704 9.82508 21.0939L14.2647 23.6243C14.3752 23.6881 14.5011 23.7218 14.6293 23.7218C14.7575 23.7218 14.8833 23.6881 14.9938 23.6243L20.414 20.5363V22.6744C20.4147 22.6853 20.4125 22.6963 20.4078 22.7062C20.403 22.7162 20.3961 22.7249 20.3873 22.7313L15.8993 25.2881C14.9395 25.8335 13.7992 25.9811 12.7293 25.6983L12.7291 25.698ZM23.3438 23.4393C23.3422 24.5316 22.9022 25.579 22.1198 26.3517C21.3372 27.1246 20.2762 27.5599 19.1691 27.5622C18.1918 27.5636 17.2451 27.2259 16.4944 26.6081C16.5283 26.5901 16.5876 26.5578 16.6263 26.5344L21.0659 24.0041C21.1774 23.9415 21.2698 23.8509 21.3339 23.7412C21.3981 23.6316 21.4315 23.5073 21.4307 23.3809V17.2054L23.3072 18.2744C23.3172 18.2793 23.3255 18.2864 23.332 18.2953C23.3384 18.3042 23.3422 18.3144 23.3438 18.3253V23.4396V23.4393ZM27.5225 20.0731C27.4548 20.8538 27.1629 21.5992 26.6814 22.2221C26.1997 22.8451 25.5483 23.3198 24.8032 23.5907V18.3787C24.8042 18.2525 24.7713 18.1283 24.7075 18.0189C24.6438 17.9094 24.5519 17.8186 24.441 17.756L19.0208 14.668L20.8973 13.5993C20.9066 13.5932 20.9171 13.5895 20.9283 13.5886C20.9393 13.5875 20.9504 13.5894 20.9606 13.5936L25.449 16.1503C26.1367 16.5423 26.697 17.1192 27.0642 17.814C27.4314 18.5087 27.5905 19.2922 27.5228 20.0729L27.5225 20.0731Z" fill="white"/>
                            </svg>
                        </div>
                        <div class="text">
                            <p>${text}</p>
                        </div>
                        
                    </div>
                        <p class="time">${currentTime}</p>
                </div>`;
        }

        chatLogs.innerHTML += messageHtml;
        scrollToEnd(chatLogs);
    }

    function scrollToEnd(element) {
        element.scrollTop = element.scrollHeight;
    }


    var smartModelDialog = document.getElementById("smartModelDialog");
    var progressbarDialog = document.getElementById("progressbarDialog");
    var continueButton = document.getElementById("continueButton");
    var notNowButton = document.getElementById("notNowButton");
    var closeSmartModelDialog = document.getElementById("closeSmartModelDialog");
    var innerBar = document.getElementById("innerBar");
    var percentage = document.getElementById("percentage");

    closeSmartModelDialog.onclick = function() {
        smartModelDialog.style.display = "none";
    };

    continueButton.onclick = function() {
        smartModelDialog.style.display = "none";
        progressbarDialog.style.display = "block";
        startProgressBar(600000); // 60 seconds
        getApiJsonForSmartAi();
    };

    notNowButton.onclick = function() {
        smartModelDialog.style.display = "none";
    };
    var progressInterval;
    var width = 0;

    function startProgressBar(duration) {
        clearInterval(progressInterval); // Clear any previous intervals
        progressInterval = setInterval(function() {
            if (width < 100) {
                width++;
                innerBar.style.width = width + "%";
                percentage.innerHTML = width + "%";
            } else {
                clearInterval(progressInterval);
            }
        }, duration / 100);
    }

    function completeProgressBar() {
        var targetWidth = 100;
        var interval = setInterval(function() {
            if (width < targetWidth) {
                width++;
                innerBar.style.width = width + "%";
                percentage.innerHTML = width + "%";
            } else {
                clearInterval(interval);
                setTimeout(function() {
                    progressbarDialog.style.display = "none";
                    width = 0;
                    innerBar.style.width = width + "%";
                    percentage.innerHTML = width + "%";
                    swal("All Done!", "Smart comments are added for individual steps and variables.\nPlease verify the results.", "success");
                }, 500); // Pause for 0.5 seconds
            }
        }, 10); // Fast completion to 100%
    }


    function getApiJsonForSmartAi(servicePath) {
        var apiCallCompleted = false;
        //var totalDuration = 90000; // 90 seconds

        var startTime = Date.now();

        if (!servicePath) servicePath = loadFile;
        var dataJson = {
            "latest": {
                "createdTS": "",
                "input": [],
                "output": [],
                "api": [],
                "api_info": {
                    "title": "",
                    "description": ""
                }
            }
        };
        var version = "latest";
        dataJson[version].input = inputJstreeRef.get_json('#', { flat: false });
        dataJson[version].output = outputJstreeRef.get_json('#', { flat: false });
        dataJson[version].api = flowDesignerJsTreeRef.get_json('#', { flat: false });
        dataJson[version].api_info.title = $("#api_info_title").val();
        dataJson[version].api_info.description = $("#api_info_description").val();
        removeIcons(dataJson[version].input);
        removeIcons(dataJson[version].output);
        removeIcons(dataJson[version].api);
        dataJson.consumers = $("#serviceConsumers").val().toString();
        dataJson.developers = $("#serviceDevelopers").val().toString();
        dataJson.enableServiceDocumentValidation = $("#enableServiceDocumentValidation").prop("checked");

        if (null == $("#created_on_service").val() || '' == $("#created_on_service").val()) {
            dataJson.created_on = new Date().getTime() + "";
        } else {
            dataJson.created_on = $("#created_on_service").val() + "";
        }

        dataJson.modified_on = new Date().getTime();

        var data = JSON.stringify(dataJson);

        var message = data + "\n" +
            "Do not modify this JSON\n" +
            "Add comment to every new step and nested step under data array element. \n" +
            "Add encoded base64 fieldDescription field to input and output array element\n" +
            "Add title and description for overall service\n" +
            "Do not print the complete service.\n" +
            "Each step has a unique \"guid\", so provide the comments in JSON format for each \"guid\" and finally print the response in the JSON format like:\n" +
            "\n" +
            "[{\n" +
            "  \"guid\": \"qwer\",\n" +
            "  \"comment\": \"comment for step 1\",\n" +
            "},{\n" +
            "  \"guid\": \"ddsds\",\n" +
            "  \"comment\": \"comment for step 2\",\n" +
            "},{\n" +
            "  \"guid\": \"ffgfg\",\n" +
            "  \"comment\": \"comment for step 3,\n" +
            "}]\n" +
            "\n" +
            "Please generate a suitable title and description of the overall service as the last elements of the above array\n";

        const assistantID = ASSISTANT_ID;
        $("#percentage_b").html("Writing comments and descriptions... [Preparing]");

        sendMessageToThread(message, assistantID, true).then(response => {
            if ("null" == response.thread_id) {
                swal("Error Occurred", "Error in communication.", "error");
                apiCallCompleted = true;
                progressbarDialog.style.display = "none";
                width = 0;
                innerBar.style.width = width + "%";
                percentage.innerHTML = width + "%";
                return ;
            }
            apiCallCompleted = true;

            $("#percentage_b").html("Writing comments and descriptions... [Initializing]");

            eventStream("/v1/" + response.thread_id + "/run_stream?serviceType=" + SERVICE_TYPE + "&assistant_id=" + ASSISTANT_ID,
                function() {


                },
                function (errorMsg) {
                    progressbarDialog.style.display = "none";
                    width = 0;
                    innerBar.style.width = width + "%";
                    percentage.innerHTML = width + "%";
                    swal("Error Occurred", errorMsg, "error");

                },
                function (response) {
                    $("#percentage_b").html("Writing comments and descriptions... [Completed]");
                    let extractedJson = null;

                    for (let i = 0 ; i < response.length ; i++) {
                        let json = extractJsonFromResponse(response[i]);
                        if (json === null) {
                            json = response[i];
                        }
                        if (extractedJson == null) {
                            extractedJson = json;
                        } else {
                            extractedJson += json;
                        }
                    }

                    if (extractedJson !== null) {
                        updateServiceWithComments(true, extractedJson, data);
                        completeProgressBar();

                    }

            }, function (bytes) {
                    $("#percentage_b").html("Writing comments and descriptions... " + formatSize(bytes));
                }, response.thread_id);
        }).catch(error => {
            apiCallCompleted = true;
            swal("Error Occurred", "Please check your network connection", "error");
            console.error("Error fetching response:", error);
            progressbarDialog.style.display = "none";
            width = 0;
            innerBar.style.width = width + "%";
            percentage.innerHTML = width + "%";
        });

       /* setTimeout(function() {
            if (!apiCallCompleted) {
                swal("Timeout", "Request timed out. Please try again.", "error");
                progressbarDialog.style.display = "none";
            }
        }, totalDuration);*/
    }


    $("#chat-circle").click(function() {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
        try {
            asyncRestRequest(`/packages.middleware.pub.syncloopGPT.checkIfTokenExists.main`, null, 'POST', function (data) {
                if (data.checkToken) {
                    if(reply.trim() !== "") {
                        updateChatLog("Bot", reply);
                    }
                    document.getElementById("chat-input").disabled = true;
                    $("#chat-input").css("cursor","not-allowed");
                    $("#chat-submit").css("cursor","not-allowed");
                } else{
                    if ((ASSISTANT_ID != "" && SERVICE_TYPE == "SQL") || SERVICE_TYPE == "API") {
                        updateChatLog("Bot", "Hello, how may I help you?");
                    }

                    if ($("#chat-input").length > 0) {
                        document.getElementById("chat-input").disabled = false; // Enable the input field
                        $("#chat-input").css("cursor", "");
                    }

                    if ($("#chat-submit").length > 0) {
                        $("#chat-submit").css("cursor", "");
                    }
                }
            }, function (response) {
                if(reply.trim() !== "") {
                    updateChatLog("Bot", reply);
                }
                document.getElementById("chat-input").disabled = true;
                $("#chat-input").css("cursor","not-allowed");
                $("#chat-submit").css("cursor","not-allowed");
            });
        } catch (error) {
            swal("Error Occurred", "Please check your network connection", "error");
        }
    });

    $(".chat-box-toggle").click(function() {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    });

    if (SERVICE_TYPE == "SQL") {
        $("#chat-input").attr("placeholder", "preparing chatbot...");
        $("#chat-preparing").html("preparing...");
        $("#chatgpt-input-field").hide();

        asyncRestRequest("/packages.middleware.pub.syncloopGPT.getMyAssistantId.main?file=" +
            loadFile.replaceAll("files/", "").replaceAll(".sql", ""), null, "GET", function (response) {
            $("#chat-preparing").hide();
            if (null == response.response) {
                updateChatLog("Bot", "Add your JDBC configurations");
                return ;
            }
            ASSISTANT_ID = response.response.id;
            $("#chatgpt-input-field").show();
            $("#chat-input").attr("placeholder", "Write your message here...");

            $("#assistant_name").html(response.response.name);
            $("#assistant_name").attr("title", response.response.name);
        });
    }
});

var progressbarDialog = document.getElementById("progressbarDialogForSmartImport");
var innerBar = document.getElementById("innerBarForSmartImport");
var percentage = document.getElementById("percentageForSmartImport");

function openSmartImportPopup() {
    const textCode = document.getElementById('importMessage').value;
    asyncRestRequest(`/packages.middleware.pub.syncloopGPT.checkIfTokenExists.main`, null, 'POST', function (data) {
        if (data.checkToken) {
            swal({
                title: "<span class='smai_title'>Please complete your setup</span>",
                text: "For instructions on how to setup smart feature <a style='color:#175cff; text-decoration:underline;' href='https://docs.syncloop.com/docs/syncloopgpt/setup_gpt_token'>click here</a>",
                icon: "warning",
                button: true,
                type: "error",
                dangerMode: true,
                html: true
            });
        } else{
            //document.getElementById("smartModelDialog").style.display = "block";
            if(textCode.trim() !== ""){
                getApiJsonForSmartImport(textCode);
            }
        }
    }, function (response) {
        swal({
            title: "<span class='smai_title'>Please complete your setup</span>",
            text: "For instructions on how to setup smart feature <a style='color:#175cff; text-decoration:underline;' href='https://docs.syncloop.com/docs/syncloopgpt/setup_gpt_token'>click here</a>",
            icon: "warning",
            button: true,
            type: "error",
            dangerMode: true,
            html: true
        });
    });
}

function processFileForSmartImport(input) {
    var file = input.files[0];
    var fileName = file.name;

    // Allowed file types
    var validFileTypes = [
        'text/plain', 'application/json',
        'application/x-csharp', 'application/java', 'text/x-c++src', 'text/x-python',
        'application/javascript', 'text/html', 'text/css'
    ];

    // Allowed file extensions
    var validFileExtensions = [
        '.txt', '.json', '.api', '.c', '.cpp', '.cs', '.java', '.py', '.js', '.html', '.css', '.vm'
    ];

    var isValidFileType = validFileTypes.includes(file.type) || validFileExtensions.some(ext => fileName.endsWith(ext));

    if (isValidFileType) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var fileContent = e.target.result;
            getApiJsonForSmartImport(fileContent);
        };

        reader.onerror = function(e) {
            console.error("Error reading file:", e);
            swal({
                    title: "Error",
                    text: "There was an error reading the file. Please try again.",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    cancelButtonText: "",
                    confirmButtonText: "Okay",
                    showLoaderOnConfirm: true,
                    closeOnConfirm: true,
                    closeOnCancel: true
                },
                function(isConfirm) {
                    document.getElementById('resetBtn').click();
                });
        };

        reader.readAsText(file);
    } else {
        swal({
                title: "Invalid File Type",
                text: "The selected file format is not supported. Please upload a valid coding file or a plain text (.txt), JSON (.json), or API (.api) format.",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "",
                confirmButtonText: "OK",
                showLoaderOnConfirm: true,
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm) {
                document.getElementById('resetBtn').click();
            });
    }
}



function isJSON(str) {
    try {
        JSON.parse(removeJSONComments(str));
        return true;
    } catch (e) {
        return false;
    }
}

function getApiJsonForSmartImport(data) {
    var apiCallCompleted = false;
    var totalDuration = 90000; // 90 seconds
    if (isJSON(data) && JSON.parse(removeJSONComments(data)).latest) {
        let requiredReset = !SDK_EMBEDDED;
        SDK_EMBEDDED = true;
        try {
            let parsedJSON = JSON.parse(data);
            missingPartBuilder(parsedJSON.latest.api);
            loadApiService(parsedJSON);
        } catch (e) {

        }
        if (requiredReset) {
            SDK_EMBEDDED = false;
        }
        $("#smartImportModal").modal('toggle');
        swal("All Done!", "Your file has been imported successfully.", "success");
        return;
    }

    var message = "Convert this code to Syncloop service: " + "\n" + data;

    const assistantID = "asst_Cx2244ZvFubBppoqP7wpg23v";
    $("#smartImportModal").modal('toggle');
    progressbarDialog.style.display = "block";
    width = 0;
    innerBar.style.width = width + "%";
    percentage.innerHTML = width + "%";
    startProgressBarForSmartImport(600000); // 60 seconds

    $("#percentage_b2").html("Importing your file... [Preparing]");

    sendMessageToThread(message, assistantID, true).then(response => {
        apiCallCompleted = true;

        if ("null" == response.thread_id) {
            swal("Error Occurred", "Error in communication.", "error");
            apiCallCompleted = true;
            progressbarDialog.style.display = "none";
            width = 0;
            innerBar.style.width = width + "%";
            percentage.innerHTML = width + "%";
            return ;
        }

        $("#percentage_b2").html("Importing your file... [Initializing]");
        eventStream("/v1/" + response.thread_id + "/run_stream?serviceType=" + SERVICE_TYPE + "&assistant_id=" + ASSISTANT_ID,
            function() {
            },
            function (errorMsg) {
                progressbarDialog.style.display = "none";
                width = 0;
                innerBar.style.width = width + "%";
                percentage.innerHTML = width + "%";
                swal("Error Occurred", errorMsg, "error");

            },
            function (response) {
                $("#percentage_b2").html("Importing your file... [Completed]");
                let extractedJson = null;

                for (let i = 0 ; i < response.length ; i++) {
                    let json = response.length > 1 ? null : extractJsonFromResponse(response[i]);
                    if (json === null) {
                        json = response[i];
                        if (i > 0) {
                            json = response[i].replace(/```json/g, '');
                        }
                        if (i == (response.length - 1)) {
                            //json = json.replace(/```/g, '');
                        }
                    }
                    if (extractedJson == null) {
                        extractedJson = json.trim();
                    } else {
                        extractedJson += json.trim();
                    }
                }
                extractedJson = extractedJson.replace(/\n/g, '');
                if (response.length > 1) {
                    extractedJson = extractJsonFromResponse(extractedJson);
                }

                if (extractedJson !== null) {
                    //updateServiceWithComments(true, extractedJson, data);
                    //updateServiceUsingGPT(true, JSON.stringify(extractedJson));
                    let requiredReset = !SDK_EMBEDDED;
                    SDK_EMBEDDED = true;
                    try {
                        if (isJSON(removeJSONComments(extractedJson))) {
                            let parsedJSON = JSON.parse(removeJSONComments(extractedJson));
                            missingPartBuilder(parsedJSON.latest.api);
                            loadApiService(parsedJSON);
                        } else {
                            console.log(extractedJson);
                            swal("Error Occurred", "Please try again!", "error");
                            progressbarDialog.style.display = "none";
                            width = 0;
                            innerBar.style.width = width + "%";
                            percentage.innerHTML = width + "%";
                            return;
                        }
                    } catch (e) {

                    }
                    if (requiredReset) {
                        SDK_EMBEDDED = false;
                    }
                    completeProgressBarForSmartImport();
                    $("#importMessage").val('');

                }

            }, function (bytes) {
                $("#percentage_b2").html("Importing your file... " + formatSize(bytes));
            }, response.thread_id);


    }).catch(error => {
        apiCallCompleted = true;
        swal("Error Occurred", "Please check your network connection", "error");
        console.error("Error fetching response:", error);
        progressbarDialog.style.display = "none";
        width = 0;
        innerBar.style.width = width + "%";
        percentage.innerHTML = width + "%";
    });

     /*setTimeout(function() {
         if (!apiCallCompleted) {
             swal("Timeout", "Request timed out. Please try again.", "error");
             progressbarDialog.style.display = "none";
         }
     }, totalDuration);*/
}

var progressInterval;
var width = 0;

function startProgressBarForSmartImport(duration) {
    clearInterval(progressInterval); // Clear any previous intervals
    progressInterval = setInterval(function() {
        if (width < 100) {
            width++;
            innerBar.style.width = width + "%";
            percentage.innerHTML = width + "%";
        } else {
            clearInterval(progressInterval);
        }
    }, duration / 100);
}


function completeProgressBarForSmartImport() {
    var targetWidth = 100;
    var interval = setInterval(function() {
        if (width < targetWidth) {
            width++;
            innerBar.style.width = width + "%";
            percentage.innerHTML = width + "%";
        } else {
            clearInterval(interval);
            setTimeout(function() {
                progressbarDialog.style.display = "none";
                width = 0;
                innerBar.style.width = width + "%";
                percentage.innerHTML = width + "%";
                swal("All Done!", "Your file has been imported successfully.", "success");
            }, 500); // Pause for 0.5 seconds
        }
    }, 10); // Fast completion to 100%
}


function sendInputValue() {
    var inputValue = document.getElementById('elementSetValueInput').value;
    var selectedRadio = document.querySelector('input[name="setValueTag"]:checked').id;
    processData(inputValue, selectedRadio);
}

function modifyPopupData(inputValue, selectedRadio) {
    var modifiedInputValue = inputValue + " - modified";
    document.getElementById('elementSetValueInput').value = modifiedInputValue;

    var radioButtons = document.getElementsByName('setValueTag');
    var validRadioIds = Array.from(radioButtons).map(radio => radio.id);

    if (validRadioIds.includes(selectedRadio)) {
        document.getElementById(selectedRadio).checked = true;
    } else {
        console.error("Invalid radio button ID");
    }
}

function processData(inputValue, selectedRadio) {
    console.log("Original Input Value:", inputValue);
    console.log("Original Selected Radio Button:", selectedRadio);

    var message = "Correct the expression" + "\n" + "Text - "+ inputValue + "\n" + "Evaluate" + selectedRadio;

    const assistantID = "asst_Cx2244ZvFubBppoqP7wpg23v";

    sendMessageToThread(message, assistantID, true).then(response => {
        console.log("RES --- " + response);
    }).catch(error => {
        swal("Error Occurred", "Please check your network connection", "error");
        console.error("Error fetching response:", error);
    });

    selectedRadio = "element_PackageVariable";

    modifyPopupData(inputValue, selectedRadio);

    console.log("Modified Input Value:", document.getElementById('elementSetValueInput').value);
    console.log("Modified Selected Radio Button:", document.querySelector('input[name="setValueTag"]:checked').id);

}

function reformatSQLAIJson(json) {
    if (!json.success) {
        return BLANK_SQL_JSON;
    }

    let outputJson = JSON.parse(JSON.stringify(BLANK_SQL_JSON));

    let inputs = json.input.split("#");
    for (let i = 0 ; i < inputs.length ; i++) {
        if (inputs[i] == "") {
            continue;
        }
        let pair = inputs[i].split("|");
        let input = {
            "id": "j1_" + (5 + i),
            "text": pair[0],
            "icon": null,
            "li_attr": {
                "id": "j1_" + (5 + i),
            },
            "a_attr": {
                "href": "#",
                "id": "j1_" + (5 + i) + "_anchor"
            },
            "state": {
                "loaded": true,
                "opened": false,
                "selected": true,
                "disabled": false
            },
            "data": {
                "guid": uuidv4(),
                "columnType": "-1"
            },
            "children": [],
            "type": pair[1]
        };
        outputJson.input[0].children.push(input);
    }


    let outputs = json.output.split("#");
    for (let i = 0 ; i < outputs.length ; i++) {
        if (outputs[i] == "") {
            continue;
        }
        let pair = outputs[i].split("|");
        let text = pair[0];
        if (text.includes(".")) {
            text = text.split(".")[1];
        }
        let output = {
            "id": "j2_" + (5 + i),
            "text": pair[0],
            "icon": null,
            "li_attr": {
                "id": "j2_" + (5 + i)
            },
            "a_attr": {
                "href": "#",
                "id": "j2_" + (5 + i) + "_anchor"
            },
            "state": {
                "loaded": true,
                "opened": false,
                "selected": true,
                "disabled": false
            },
            "data": {
                "guid": uuidv4(),
                "columnType": "-1"
            },
            "children": [],
            "type": pair[1]
        };
        outputJson.output[0].children.push(output);
    }

    outputJson.sql = btoa(json.sql);

    return outputJson;

}

let BLANK_SQL_JSON = {
    "input": [
        {
            "id": "j1_2",
            "text": "inputDocList",
            "icon": null,
            "li_attr": {
                "id": "j1_2"
            },
            "a_attr": {
                "href": "#",
                "id": "j1_2_anchor"
            },
            "state": {
                "loaded": true,
                "opened": true,
                "selected": false,
                "disabled": false,
                "hidden": false
            },
            "data": {

            },
            "children": [

            ],
            "type": "documentList"
        },
        {
            "id": "j1_3",
            "text": "txConn",
            "icon": null,
            "li_attr": {
                "id": "j1_3"
            },
            "a_attr": {
                "href": "#",
                "id": "j1_3_anchor"
            },
            "state": {
                "loaded": true,
                "opened": false,
                "selected": false,
                "disabled": false,
                "hidden": false
            },
            "data": {

            },
            "children": [

            ],
            "type": "javaObject"
        },
        {
            "id": "j1_4",
            "text": "isTxn",
            "icon": null,
            "li_attr": {
                "id": "j1_4"
            },
            "a_attr": {
                "href": "#",
                "id": "j1_4_anchor"
            },
            "state": {
                "loaded": true,
                "opened": false,
                "selected": false,
                "disabled": false,
                "hidden": false
            },
            "data": {

            },
            "children": [

            ],
            "type": "boolean"
        }
    ],
    "output": [
        {
            "id": "j2_1",
            "text": "outputDocList",
            "icon": null,
            "li_attr": {
                "id": "j2_1"
            },
            "a_attr": {
                "href": "#",
                "id": "j2_1_anchor"
            },
            "state": {
                "loaded": true,
                "opened": false,
                "selected": false,
                "disabled": false,
                "hidden": false
            },
            "data": {

            },
            "children": [

            ],
            "type": "documentList"
        },
        {
            "id": "j2_2",
            "text": "rows",
            "icon": null,
            "li_attr": {
                "id": "j2_2"
            },
            "a_attr": {
                "href": "#",
                "id": "j2_2_anchor"
            },
            "state": {
                "loaded": true,
                "opened": false,
                "selected": false,
                "disabled": false,
                "hidden": false
            },
            "data": {

            },
            "children": [

            ],
            "type": "integer"
        },
        {
            "id": "j2_3",
            "text": "success",
            "icon": null,
            "li_attr": {
                "id": "j2_3"
            },
            "a_attr": {
                "href": "#",
                "id": "j2_3_anchor"
            },
            "state": {
                "loaded": true,
                "opened": false,
                "selected": false,
                "disabled": false,
                "hidden": false
            },
            "data": {

            },
            "children": [

            ],
            "type": "boolean"
        },
        {
            "id": "j2_4",
            "text": "error",
            "icon": null,
            "li_attr": {
                "id": "j2_4"
            },
            "a_attr": {
                "href": "#",
                "id": "j2_4_anchor"
            },
            "state": {
                "loaded": true,
                "opened": false,
                "selected": false,
                "disabled": false,
                "hidden": false
            },
            "data": {

            },
            "children": [

            ],
            "type": "string"
        }
    ],
    "sql": "Ow==",
    "version": "v1",
    "consumers": "",
    "developers": "developers"
};

var progressIntervalForTestCases;
var widthForTestCases = 0;
var innerBarForTestCases = document.getElementById("innerBarForTestCases");
var percentageForTestcases = document.getElementById("percentageForTestcases");
const progressbarDialogForTestCases = document.getElementById("progressbarDialogForTestCases");


    function createSmartTestCases() {
        progressbarDialogForTestCases.style.display = "block";
        startProgressBarForTestCases(60000); // 60 seconds
        getApiJsonForSmartTestCases();
    }


    function getApiJsonForSmartTestCases(servicePath) {

        /*let lf = loadFile;

        let item1 = localStorage.getItem('currentSelectedService');
        let item2 = localStorage.getItem('currentSelectedService_type');

         if ((lf === null || lf === undefined) && item1 !== null && item2 !== null) {
             lf  = item1 + '.' + item2;
        } else {
            swal("Error Occurred", "One or both items are missing from localStorage! Please contact the administrator.", "error");
        }


        if (!servicePath) servicePath = lf;*/
        var dataJson = {
            "latest": {
                "createdTS": "",
                "input": [],
                "output": [],
                "api": [],
                "api_info": {
                    "title": "",
                    "description": ""
                }
            }
        };
        var version = "latest";
        dataJson[version].input = inputJstreeRef.get_json('#', {flat: false});
        dataJson[version].output = outputJstreeRef.get_json('#', {flat: false});
        dataJson[version].api = flowDesignerJsTreeRef.get_json('#', {flat: false});
        dataJson[version].api_info.title = $("#api_info_title").val();
        dataJson[version].api_info.description = $("#api_info_description").val();
        removeIcons(dataJson[version].input);
        removeIcons(dataJson[version].output);
        removeIcons(dataJson[version].api);
        dataJson.consumers = $("#serviceConsumers").val().toString();
        dataJson.developers = $("#serviceDevelopers").val().toString();
        dataJson.enableServiceDocumentValidation = $("#enableServiceDocumentValidation").prop("checked");

        if (null == $("#created_on_service").val() || '' == $("#created_on_service").val()) {
            dataJson.created_on = new Date().getTime() + "";
        } else {
            dataJson.created_on = $("#created_on_service").val() + "";
        }

        dataJson.modified_on = new Date().getTime();

        var data = JSON.stringify(dataJson);

        var message = data + "The output JSON must be generated based on either Case 1 or Case 2, depending on the availability of the *payload in the input section. Based on the input JSON, the elements 'queryParameters','*pathParameters', 'requestHeaders', or 'schema_json', '*payload' are to be populated.\n" +
            "\n" +
            "Case 1: When *payload is given this JSON example structure is selected. \n" +
            "\n" +
            "{\n" +
            "    \"schema\": {\n" +
            "        \"type\": \"object\",\n" +
            "        \"required\": [],\n" +
            "        \"properties\": {\n" +
            "            \"*payload\": {\n" +
            "                \"type\": \"object\",\n" +
            "                \"title\": \"*payload\",\n" +
            "                \"description\": \"\",\n" +
            "                \"required\": [],\n" +
            "                \"properties\": {\n" +
            "                    \"name\": {\n" +
            "                        \"type\": \"string\",\n" +
            "                        \"title\": \"name\",\n" +
            "                        \"description\": \"\",\n" +
            "                        \"required\": [],\n" +
            "                        \"properties\": {}\n" +
            "                    },\n" +
            "                    \"age\": {\n" +
            "                        \"type\": \"integer\",\n" +
            "                        \"title\": \"age\",\n" +
            "                        \"description\": \"\",\n" +
            "                        \"required\": [],\n" +
            "                        \"properties\": {}\n" +
            "                    }\n" +
            "                }\n" +
            "            }\n" +
            "        }\n" +
            "    },\n" +
            "    \"schema_json\": {\n" +
            "        \"*payload\": {\n" +
            "            \"name\": \"arun\",\n" +
            "            \"age\": 34,\n" +
            "            \"_toggle\": true\n" +
            "        }\n" +
            "    },\n" +
            "    \"pathParameters\": [],\n" +
            "    \"queryParameters\": [\n" +
            "        {\n" +
            "            \"text\": \"intA\",\n" +
            "            \"value\": \"3\",\n" +
            "            \"type\": \"integer\"\n" +
            "        },\n" +
            "        {\n" +
            "            \"text\": \"intB\",\n" +
            "            \"value\": \"6\",\n" +
            "            \"type\": \"integer\"\n" +
            "        }\n" +
            "    ],`\n" +
            "    \"requestHeaders\": [],\n" +
            "    \"output\": {\n" +
            "        \"response\": \"arun + 34\",\n" +
            "        \"intSum\": 9\n" +
            "    }\n" +
            "}\n" +
            "\n" +
            "Case 2: When payload is not given this JSON example structure is selected. \n" +
            "\n" +
            "{\n" +
            "    \"schema\": {\n" +
            "        \"type\": \"object\",\n" +
            "        \"required\": [],\n" +
            "        \"properties\": {}\n" +
            "    },\n" +
            "    \"schema_json\": {},\n" +
            "    \"pathParameters\": [],\n" +
            "    \"queryParameters\": [\n" +
            "        {\n" +
            "            \"text\": \"intSideA\",\n" +
            "            \"value\": \"3\",\n" +
            "            \"type\": \"integer\"\n" +
            "        },\n" +
            "        {\n" +
            "            \"text\": \"intSideB\",\n" +
            "            \"value\": \"3\",\n" +
            "            \"type\": \"integer\"\n" +
            "        },\n" +
            "        {\n" +
            "            \"text\": \"intSideC\",\n" +
            "            \"value\": \"3\",\n" +
            "            \"type\": \"integer\"\n" +
            "        }\n" +
            "    ],\n" +
            "    \"requestHeaders\": [],\n" +
            "    \"output\": {\n" +
            "        \"strTType\": \"Equilateral Triangle\",\n" +
            "        \"strMessage\": \"Traingle is possible \"\n" +
            "    }\n" +
            "}\n" +
            "\n" +
            "\n" +
            "Case 3:  When key-value pair is populcated under pathParameter values are specified. \n" +
            "\n" +
            "{\n" +
            "    \"schema\": {\n" +
            "        \"type\": \"object\",\n" +
            "        \"required\": [],\n" +
            "        \"properties\": {}\n" +
            "    },\n" +
            "    \"schema_json\": {},\n" +
            "    \"pathParameters\": [\n" +
            "        {\n" +
            "            \"text\": \"userId\",\n" +
            "            \"value\": \"muheet\"\n" +
            "        }\n" +
            "    ],\n" +
            "    \"queryParameters\": [],\n" +
            "    \"requestHeaders\": [],\n" +
            "    \"output\": {\n" +
            "        \"response\": \"muheet\"\n" +
            "    }\n" +
            "}\n" +
            "\n" +
            "Generate the JSON based on the availability of *payload, and based on that, select Case 1 JSON or Case 2 JSON example structure. Case 3 should be used when key-value paires are specified under pathParameters element. \n" +
            "\n" +
            "All variables and data types are appropriately assigned.\n" +
            "Do not print any captions for the output JSON\n" +
            "Do not include any additional description or explanation of the API service and test cases.\n" +
            "\n" +
            "\n" +
            "\n";

        const assistantID = ASSISTANT_ID;
        $("#percentage_t").html("Analyzing code and creating testcases... [Preparing]");

        sendMessageToThread(message, assistantID, true).then(response => {
            if ("null" == response.thread_id) {
                swal("Error Occurred", "Error in communication.", "error");
                apiCallCompleted = true;
                progressbarDialogForTestCases.style.display = "none";
                widthForTestCases = 0;
                innerBarForTestCases.style.widthForTestCases = widthForTestCases + "%";
                percentageForTestcases.innerHTML = widthForTestCases + "%";
                return;
            }
            apiCallCompleted = true;

            $("#percentage_t").html("Analyzing code and creating testcases... [Initializing]");

            eventStream("/v1/" + response.thread_id + "/run_stream?serviceType=" + SERVICE_TYPE + "&assistant_id=" + ASSISTANT_ID,
                function () {


                },
                function (errorMsg) {
                    progressbarDialogForTestCases.style.display = "none";
                    widthForTestCases = 0;
                    innerBarForTestCases.style.widthForTestCases = widthForTestCases + "%";
                    percentageForTestcases.innerHTML = widthForTestCases + "%";
                    swal("Error Occurred", errorMsg, "error");

                },
                function (response) {
                    $("#percentage_t").html("Analyzing code and creating testcases... [Completed]");
                    let extractedJson = null;

                    console.log("response -->", response);

                    for (let i = 0; i < response.length; i++) {
                        let json = extractJsonFromResponse(response[i]);
                        if (json === null) {
                            json = response[i];
                        }
                        if (extractedJson == null) {
                            extractedJson = json;
                        } else {
                            extractedJson += json;
                        }
                    }

                    if (extractedJson !== null) {
                        try {
                            let parsedJson = JSON.parse(extractedJson);
                            console.log("JD --> ", extractedJson);

                            if (!Array.isArray(parsedJson)) {
                                console.error("Parsed JSON is not an array:", parsedJson);
                                throw e;
                            } else {
                                saveAutomatedTestCases(parsedJson);
                                completeProgressBarForTestCases();
                            }
                        } catch (e) {
                            console.error("Failed to parse JSON:", e, extractedJson);
                            throw e;
                        }

                    }

                }, function (bytes) {
                    $("#percentage_t").html("Analyzing code and creating testcases... " + formatSize(bytes));
                }, response.thread_id);
        }).catch(error => {
            apiCallCompleted = true;
            swal("Error Occurred", "Please check your network connection", "error");
            console.error("Error fetching response:", error);
            progressbarDialogForTestCases.style.display = "none";
            widthForTestCases = 0;
            innerBarForTestCases.style.widthForTestCases = widthForTestCases + "%";
            percentageForTestcases.innerHTML = widthForTestCases + "%";
        });


    }

function startProgressBarForTestCases(duration) {
    clearInterval(progressIntervalForTestCases); // Clear any previous intervals
    progressIntervalForTestCases = setInterval(function () {
        if (widthForTestCases < 100) {
            widthForTestCases++;
            innerBarForTestCases.style.width = widthForTestCases + "%";
            percentageForTestcases.innerHTML = widthForTestCases + "%";
        } else {
            clearInterval(progressIntervalForTestCases);
        }
    }, duration / 100);
}

function completeProgressBarForTestCases() {
    var targetWidth = 100;
    var interval = setInterval(function () {
        if (widthForTestCases < targetWidth) {
            widthForTestCases++;
            innerBarForTestCases.style.width = widthForTestCases + "%";
            percentageForTestcases.innerHTML = widthForTestCases + "%";
        } else {
            clearInterval(interval);
            setTimeout(function () {
                progressbarDialogForTestCases.style.display = "none";
                widthForTestCases = 0;
                innerBarForTestCases.style.width = widthForTestCases + "%";
                percentageForTestcases.innerHTML = widthForTestCases + "%";
                swal("Saved!", "All test cases have been saved successfully!", "success");
            }, 500); // Pause for 0.5 seconds
        }
    }, 10); // Fast completion to 100%
}

function saveAutomatedTestCases(testCases) {


    var urlLoadFile = loadFile.trim() + "$";
    var fqn = ("/" + urlLoadFile).replace("/files/", "").replace(".service$", ".main").replace(".api$", ".main").replace(".flow$", ".main").replace(".sql$", ".main").split("/").join(".")


    let recentParameters = JSON.parse(localStorage.getItem("json_recent_params"));

    testCases.forEach((testCase, index) => {
        let request = {
            "schema": testCase.schema ? testCase.schema : {},
            "schema_json": testCase.schema_json ? testCase.schema_json : {},
            "pathParameters": testCase.pathParameters,
            "queryParameters": testCase.queryParameters,
            "requestHeaders": testCase.requestHeaders,
            "output": testCase.output
        };

        let testCaseName = testCase.name ? testCase.name : `Testcase${index + 1}`;

        if(request){
            $.ajax({
                type: "POST",
                url: `/packages.middleware.pub.server.build.api.saveTest.main?fqn=${fqn}&caseName=${testCaseName}`,
                data: JSON.stringify(request),
                contentType: 'application/json',
                dataType: "json",
                success: function (response) {
                    console.log(`${testCaseName} saved successfully.`);
                },
                error: function (e) {
                    console.error(`Error saving ${testCaseName}:`, e);
                    //swal("Error!", `Failed to save ${testCaseName}. Try later!`, "error");
                }
            });
        }

    });

}
