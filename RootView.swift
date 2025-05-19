//
//  RootView.swift
//  Engest
//

import SwiftUI
import FirebaseAuth

struct RootView: View {
    @State private var showSignInView: Bool = false
    @State private var selectedTab: Int = 0

    var body: some View {
        ZStack {
            if !showSignInView {
                TabView(selection: $selectedTab) {
                    NavigationStack {
                        LessonsView()
                    }
                    .tag(0)
                }
            }
        }
        .onAppear {
            checkAuthStatus()
        }
        .fullScreenCover(isPresented: $showSignInView) {
            NavigationStack {
                AuthenticationView(showSignInView: $showSignInView)
            }
        }
    }

    private func checkAuthStatus() {
        Task {
            do {
                let authUser = try AuthenticationManager.shared.getAuthenticatedUser()
                showSignInView = authUser == nil
            } catch {
                showSignInView = true
            }
        }
    }
}

#Preview {
    RootView()
}
