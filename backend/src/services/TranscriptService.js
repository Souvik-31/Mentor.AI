const { spawn } = require('child_process');
const path = require('path');

class TranscriptService {
  async getTranscript(videoId) {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, '../../scripts/get_transcript.py');
      const pythonProcess = spawn('python', [scriptPath, videoId]);

      let result = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Python process exited with code ${code}: ${error}`));
        }
        try {
          const parsedResult = JSON.parse(result);
          if (parsedResult.success) {
            resolve(parsedResult.transcript);
          } else {
            reject(new Error(parsedResult.error));
          }
        } catch (e) {
          reject(new Error(`Failed to parse Python output: ${e.message}`));
        }
      });
    });
  }
}

module.exports = new TranscriptService();
