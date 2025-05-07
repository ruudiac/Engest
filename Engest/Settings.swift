//
//  Settings.swift
//  Engest
//
//  Created by Gertrud Roos on 04.05.2025.
//

import SwiftUI
import Firebase

struct SettingsView: View {
    @AppStorage("username") private var username:String = ""
    @AppStorage("email") private var email:String = ""
    @AppStorage("password") private var password:String = ""

    var body: some View {
        VStack{
            Text("Edit Profile")
                .font(.largeTitle)
                .fontWeight(.bold)
            TextField("Enter your username", text: $username)
                .padding()
                .textFieldStyle(.roundedBorder)
                .frame(width: 250)
            TextField("Enter your email", text: $email)
                .padding()
                .textFieldStyle(.roundedBorder)
                .frame(width: 250)
            TextField("Enter your password", text: $password)
                .padding()
                .textFieldStyle(.roundedBorder)
                .frame(width: 250)
            Text("Changes will be saved")
                .font(.subheadline)
                .italic()
                .underline()
                .foregroundStyle(Color.purple)
            
        }
        .navigationTitle("Edit Profile")
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(red: 0.796, green: 0.667, blue: 0.871))
        .ignoresSafeArea()
    }
}
#Preview {
    SettingsView()
}
