import SwiftUI
import UIKit
import AVFoundation

struct Dashboard: View {
    @State private var showingImagePicker = false
    @State private var showPhotoOptions = false
    @State private var selectedImage: UIImage? = nil
    @State private var sourceType: UIImagePickerController.SourceType = .photoLibrary
    
    @State private var isRecording = false
    @State private var audioRecorder: AVAudioRecorder?
    @State private var fileURL: URL?
    @State private var audioPlayer: AVAudioPlayer?
    @State private var audioLevels: [Float] = []
    @State private var timer: Timer?
    
    var audioSession = AVAudioSession.sharedInstance()

    var body: some View {
        VStack {
            // MARK: - Profile Image Section
            if let image = selectedImage {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 200)
                    .clipShape(Circle())
                    .padding()
            } else {
                Image(systemName: "person.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(height: 100)
                    .clipShape(Circle())
                    .padding()
            }

            Button("Change Profile Picture") {
                showPhotoOptions = true
            }
            .padding()
            .background(Color.white)
            .cornerRadius(10)
            
            // MARK: - Waveform
            HStack(alignment: .center, spacing: 2) {
                ForEach(audioLevels, id: \.self) { level in
                    Capsule()
                        .fill(Color.white)
                        .frame(width: 3, height: CGFloat(level) * 100)
                }
            }
            .frame(height: 100)
            .padding(.top, 10)

            // MARK: - Audio Recording Section
            Button(isRecording ? "Stop Recording" : "Start Recording") {
                if isRecording {
                    stopRecording()
                } else {
                    startRecording()
                }
            }
            .padding()
            .background(isRecording ? Color.red : Color.purple)
            .foregroundColor(.white)
            .cornerRadius(10)

            if fileURL != nil {
                Button("Play Recording") {
                    playRecording()
                }
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(10)

                Text("Saved to: \(fileURL!.lastPathComponent)")
                    .font(.caption)
                    .foregroundColor(.white)
                    .padding(.top, 5)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(red: 0.796, green: 0.667, blue: 0.871))
        .ignoresSafeArea()
        .onAppear {
            setupAudioSession()
        }
        .confirmationDialog("Select Photo Option", isPresented: $showPhotoOptions) {
            if UIImagePickerController.isSourceTypeAvailable(.camera) {
                Button("Take Photo") {
                    sourceType = .camera
                    showingImagePicker = true
                }
            }
            Button("Choose from Library") {
                sourceType = .photoLibrary
                showingImagePicker = true
            }
            Button("Cancel", role: .cancel) {}
        }
        .sheet(isPresented: $showingImagePicker) {
            ImagePicker(image: $selectedImage, sourceType: sourceType)
        }
    }

    func setupAudioSession() {
        do {
            try audioSession.setCategory(.playAndRecord, mode: .default,options: [.defaultToSpeaker])
            try audioSession.setActive(true)
        } catch {
            print("Failed to set up audio session: \(error)")
        }
    }

    func startRecording() {
        AVCaptureDevice.requestAccess(for: .audio) { response in
            if response {
                DispatchQueue.main.async {
                    let url = self.getAudioFileURL()
                    self.fileURL = url

                    let settings: [String: Any] = [
                        AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
                        AVSampleRateKey: 12000.0,
                        AVNumberOfChannelsKey: 1,
                        AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
                    ]

                    do {
                        self.audioRecorder = try AVAudioRecorder(url: url, settings: settings)
                        self.audioRecorder?.isMeteringEnabled = true
                        self.audioRecorder?.record()

                        self.timer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { _ in
                            self.updateAudioLevels()
                        }

                        self.isRecording = true
                    } catch {
                        print("Recording failed: \(error)")
                    }
                }
            } else {
                print("Microphone permission denied")
            }
        }
    }

    func stopRecording() {
        audioRecorder?.stop()
        timer?.invalidate()
        timer = nil
        isRecording = false
    }

    func playRecording() {
        guard let url = fileURL else { return }
        print("Playing file at: \(url)")

        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.prepareToPlay()
            audioPlayer?.play()
        } catch {
            print("Playback failed: \(error)")
        }
    }

    func updateAudioLevels() {
        audioRecorder?.updateMeters()
        let level = audioRecorder?.averagePower(forChannel: 0) ?? -120
        let normalized = max(0, min(1, (level + 80) / 80)) // Normalize
        audioLevels.append(normalized)

        if audioLevels.count > 50 {
            audioLevels.removeFirst()
        }
    }

    func getAudioFileURL() -> URL {
        let directory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        return directory.appendingPathComponent("recording.m4a")
    }
}

// MARK: - Image Picker
struct ImagePicker: UIViewControllerRepresentable {
    @Binding var image: UIImage?
    var sourceType: UIImagePickerController.SourceType

    class Coordinator: NSObject, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
        let parent: ImagePicker

        init(parent: ImagePicker) {
            self.parent = parent
        }

        func imagePickerController(_ picker: UIImagePickerController,
                                   didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let uiImage = info[.originalImage] as? UIImage {
                parent.image = uiImage
            }

            picker.dismiss(animated: true)
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            picker.dismiss(animated: true)
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.delegate = context.coordinator
        picker.sourceType = sourceType
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}
}

#Preview {
    Dashboard()
}

