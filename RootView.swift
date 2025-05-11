//
//  RootView.swift
//  Engest
//
//  Created by Gertrud Roos on 11.05.2025.
//

import SwiftUI

struct RootView: View {
    
    @State private var showSignInView: Bool = false
    
    var body: some View {
        ZStack{
            NavigationStack{
                SettingsView(showSignInView: $showSignInView)
            }
        }
        .onAppear {
            do {
                let authUser = try AuthenticationManager.shared.getAuthenticatedUser()
                self.showSignInView = (authUser == nil)
                print("Authenticated user: \(String(describing: authUser.email))")
            } catch {
                print("No authenticated user. Showing sign in view.")
                self.showSignInView = true
            }
        }

        .fullScreenCover(isPresented: $showSignInView) {
            NavigationStack{
                AuthenticationView(showSignInView: $showSignInView)
            }
        }
    }
}

#Preview {
    RootView()
}
