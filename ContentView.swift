import SwiftUI
import RealityKit
import ARKit

struct ContentView: View {
    @State private var arView = ARView(frame: .zero)

    var body: some View {
        ZStack {
            ARViewContainer(arView: $arView)
                .edgesIgnoringSafeArea(.all)

            VStack {
                Spacer()
                Button(action: {
                    placeBox(in: arView)
                }) {
                    Text("Place Box")
                        .padding()
                        .background(Color.white.opacity(0.8))
                        .cornerRadius(10)
                }
                .padding(.bottom, 40)
            }
        }
    }

    func placeBox(in arView: ARView) {
        guard let cameraTransform = arView.session.currentFrame?.camera.transform else { return }

        var translation = matrix_identity_float4x4
        translation.columns.3.z = -0.3  // 30 cm in front of camera

        let transform = simd_mul(cameraTransform, translation)

        let anchor = AnchorEntity(world: transform)
        let box = ModelEntity(
            mesh: .generateBox(size: 0.1),
            materials: [SimpleMaterial(color: .blue, isMetallic: false)]
        )
        anchor.addChild(box)
        arView.scene.addAnchor(anchor)
    }
}

struct ARViewContainer: UIViewRepresentable {
    @Binding var arView: ARView

    func makeUIView(context: Context) -> ARView {
        let config = ARWorldTrackingConfiguration()
        config.planeDetection = [] // not needed now
        arView.session.run(config, options: [])
        return arView
    }

    func updateUIView(_ uiView: ARView, context: Context) {}
}
