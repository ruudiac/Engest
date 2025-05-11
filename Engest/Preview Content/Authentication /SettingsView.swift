//
//  SettingsView.swift
//  Engest
//
//  Created by Gertrud Roos on 11.05.2025.
//

import SwiftUI

@MainActor
final class SettingsViewModel: ObservableObject{
    
    func signOut() throws{
       try AuthenticationManager.shared.signOut()
    }
}

struct SettingsView: View {
    
    @StateObject private var viewModel = SettingsViewModel()
    @Binding var showSignInView: Bool
    
    var body: some View {
        List{
            Button("Sign out"){
                Task{
                    do{
                        try viewModel.signOut()
                        showSignInView = true
                    }catch{
                        print(error)
                        
                    }
                }
            }
        }
        .navigationBarTitle("Settings")
    }
}

#Preview {
    NavigationStack{
        SettingsView(showSignInView: .constant(false))
    }
}
