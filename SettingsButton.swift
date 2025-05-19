import SwiftUI

struct SettingsButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(hex: "A978C5"))
                .frame(width: 120, height: 90)
                .overlay(
                    Text(title)
                        .foregroundColor(.white)
                        .font(.system(size: 14, weight: .semibold))
                        .multilineTextAlignment(.center)
                        .padding(8)
                )
                .shadow(color: .black.opacity(0.3), radius: 6, x: 2, y: 4)
        }
    }
}
