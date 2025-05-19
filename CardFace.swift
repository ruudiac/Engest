import SwiftUI

struct CardFace: View {
    let text: String
    let color: Color
    let textColor: Color

    var body: some View {
        RoundedRectangle(cornerRadius: 20)
            .fill(color)
            .shadow(radius: 5)
            .frame(width: 300, height: 200)
            .overlay(
                RoundedRectangle(cornerRadius: 20)
                    .stroke(Color.gray, lineWidth: 1)
            )
            .overlay(
                Text(text)
                    .font(.system(size: 32, weight: .bold))
                    .foregroundColor(textColor)
                    .padding()
                    .multilineTextAlignment(.center)
            )
    }
}
