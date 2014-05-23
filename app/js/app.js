(function () {
  'use strict';

  function trimString(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  var passwordField = document.getElementById('PasswordField');
  var messageField = document.getElementById('MessageField');
  var encryptButton = document.getElementById('EncryptButton');
  var decryptButton = document.getElementById('DecryptButton');


  encryptButton.onclick = function() {
    if (!messageField.value || !passwordField.value) { return; }

    var encrypted = aesCrypto.encrypt(
      trimString(messageField.value),
      trimString(passwordField.value));

    messageField.value = encrypted;

    return false;
  };

  decryptButton.onclick = function() {
    if (!messageField.value || !passwordField.value) { return; }

    var decrypted = aesCrypto.decrypt(
      trimString(messageField.value),
      trimString(passwordField.value));

    if (decrypted) { messageField.value = decrypted; }

    return false;
  };

})();