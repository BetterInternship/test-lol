const authorization_endpoint = "https://api.opportunity.wfglobal.org/api/v1/transformerservice/speech/token";
let SpeechSDK, reco;

async function enumerate_microphones() {
	if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
		alert(`Unable to query for audio input devices. Default will be used.\r\n`);
		return;
	}

	await navigator.mediaDevices.getUserMedia({ audio: true, video: true }) 

	await navigator.mediaDevices.enumerateDevices().then((devices) => {
		interview_question_modal_microphone_field.innerHTML = '';

		// Not all environments will be able to enumerate mic labels and ids. All environments will be able
		// to select a default input, assuming appropriate permissions.
		const default_option = document.createElement('option');
		default_option.appendChild(document.createTextNode('Default Microphone'));
		interview_question_modal_microphone_field.appendChild(default_option);

		// Put the devices as options in the field
		for (const device of devices) {
			if (device.kind === "audioinput") {
				if (!device.deviceId) {
					window.console.log(
						`Warning: unable to enumerate a microphone deviceId. This may be due to limitations`
							+ ` with availability in a non-HTTPS context per mediaDevices constraints.`); 
				} else {
					const option = document.createElement('option');
					option.value = device.deviceId;
					option.appendChild(document.createTextNode(device.label));
					interview_question_modal_microphone_field.appendChild(option);
				}
			}
		}
	});
}

function request_authorization_token() {
	if (authorization_endpoint) {
		const a = new XMLHttpRequest();
		a.open("GET", authorization_endpoint);
		a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		a.send("");
		a.onload = function () {
			APP.set_speech_auth_token(JSON.parse(this.responseText).data.token);
			console.log("Got an authorization token: " + APP.speech_auth_token());
		}
	}
}

function on_canceled (sender, cancellation_event_args) {
	window.console.log(cancellation_event_args);

	console.warn("(cancel) Reason: " + SpeechSDK.CancellationReason[cancellation_event_args.reason])
	if (cancellation_event_args.reason === SpeechSDK.CancellationReason.Error) {
			console.warn(": " + cancellation_event_args.errorDetails);
	}

	APP.set_is_recording(false);
}

const second_last_index = (str, substr) => {
	const last_index = str.lastIndexOf(substr);
	if (last_index < 0) return last_index;
	const second_last_index = str.slice(0, last_index).lastIndexOf(substr);
	return second_last_index;
}

function on_recognizing(sender, recognition_event_args) {
	const result = recognition_event_args.result;
	if (interview_question_modal_draft.innerHTML.lastIndexOf('<br>') >= 0)
		interview_question_modal_draft.innerHTML = interview_question_modal_draft.innerHTML
			.slice(0, interview_question_modal_draft.innerHTML.lastIndexOf('<br>') + 4) + `${result.text} [...]`;
	else interview_question_modal_draft.innerHTML = `${result.text} [...]`;
	console.warn(`(RECOGNIZING) Reason: ${SpeechSDK.ResultReason[result.reason]} Text: ${result.text}`);
}

function on_recognized(sender, recognition_event_args) {
	const result = recognition_event_args.result;
	on_recognized_result(recognition_event_args.result);
}

function on_recognized_result(result) {
	console.warn(`(RECOGNIZED)  Reason: ${SpeechSDK.ResultReason[result.reason]}`);

	switch (result.reason) {
		case SpeechSDK.ResultReason.NoMatch:
			const noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(result);
			console.warn(`NoMatchReason: ${SpeechSDK.NoMatchReason[noMatchDetail.reason]}`);
			break;
		case SpeechSDK.ResultReason.Canceled:
			const cancelDetails = SpeechSDK.CancellationDetails.fromResult(result);
			console.warn(`CancellationReason: ${SpeechSDK.CancellationReason[cancelDetails.reason]}`
				+ (cancelDetails.reason === SpeechSDK.CancellationReason.Error 
						? `: ${cancelDetails.errorDetails}` : ``));
			break;
		case SpeechSDK.ResultReason.RecognizedSpeech:
		case SpeechSDK.ResultReason.TranslatedSpeech:
		case SpeechSDK.ResultReason.RecognizedIntent:
			const detailedResultJson = JSON.parse(result.json);
			const displayText = detailedResultJson['DisplayText'];
			console.log(interview_question_modal_draft.innerHTML.lastIndexOf('<br>'), interview_question_modal_draft.innerHTML, displayText)
			if (interview_question_modal_draft.innerHTML.lastIndexOf('<br>') >= 0) {
				interview_question_modal_draft.innerHTML = interview_question_modal_draft.innerHTML
					.slice(0, interview_question_modal_draft.innerHTML.lastIndexOf('<br>') + 4) + displayText + '<br>';
			} else {
				interview_question_modal_draft.innerHTML = displayText + '<br>';
			}
			console.error(interview_question_modal_draft.innerHTML)
			break;
	}
}

function on_session_started(sender, session_event_args) {
	interview_question_modal_draft.textContent = '';
}

function on_session_stopped(sender, session_event_args) {
	// ! nothing needed
}

function get_audio_config() {
	// If an audio file was specified, use it. Otherwise, use the microphone.
	// Depending on browser security settings, the user may be prompted to allow microphone use. Using
	// continuous recognition allows multiple phrases to be recognized from a single use authorization.
	const audio_file = APP.audio_file();
	
	if (audio_file)
		return SpeechSDK.AudioConfig.fromWavFileInput(audio_file);
	
	if (interview_question_modal_microphone_field.value)
		return SpeechSDK.AudioConfig.fromMicrophoneInput(interview_question_modal_microphone_field.value);

	return SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
}

function get_speech_config(sdkConfigType) {
	const authorization_token = APP.speech_auth_token();
	let speech_config;

	// Set auth token for sdk
	if (authorization_token)
		speech_config = sdkConfigType.fromAuthorizationToken(authorization_token, 'eastus');
	else alert('missing auth token');

	// Setting the result output format to Detailed will request that the underlying
	// result JSON include alternates, confidence scores, lexical forms, and other
	// advanced information.
	speech_config.outputFormat = SpeechSDK.OutputFormat.Detailed;
	speech_config.speechRecognitionLanguage = 'en-US';
	return speech_config;
}

function apply_common_configuration_to(recognizer) {
	recognizer.recognizing = on_recognizing;
	recognizer.recognized = on_recognized;
	recognizer.canceled = on_canceled;
	recognizer.sessionStarted = on_session_started;
	recognizer.sessionStopped = on_session_stopped;
}

const start_tts = () => {
	const audio_config = get_audio_config();
	const speech_config = get_speech_config(SpeechSDK.SpeechConfig);
	if (!speech_config) return;

	// Create the SpeechRecognizer and set up common event handlers and PhraseList data
	reco = new SpeechSDK.SpeechRecognizer(speech_config, audio_config);
	apply_common_configuration_to(reco);

	// Start the continuous recognition. Note that, in this continuous scenario, activity is purely event-
	// driven, as use of continuation (as is in the single-shot sample) isn't applicable when there's not a
	// single result.
	reco.startContinuousRecognitionAsync();
	APP.set_is_recording(true);
}

const stop_tts = () => {
	reco.stopContinuousRecognitionAsync(
		function () {
			reco.close();
			reco = undefined;
		},
		function (err) {
			reco.close();
			reco = undefined;
		}
	);

	APP.set_is_recording(false);
}