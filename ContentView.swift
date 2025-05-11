import SwiftUI

struct APIResponse: Codable {
    let results: [RandomUser]
}

struct RandomUser: Codable {
    let name: Name
    let email: String
    let picture: Picture
}

struct Name: Codable {
    let first: String
    let last: String
}

struct Picture: Codable {
    let large: String
}

struct ContentView: View {
    @State private var user: RandomUser?
    @State private var isLoading = false
    @State private var errorMessage: String?
    
    var body: some View {
        VStack(spacing: 20) {
            if let user = user {
                Text("\(user.name.first) \(user.name.last)")
                    .font(.title)
                Text(user.email)
                    .foregroundColor(.gray)
                
                AsyncImage(url: URL(string: user.picture.large)) { image in
                    image.resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 150, height: 150)
                        .clipShape(Circle())
                        .shadow(radius: 10)
                } placeholder: {
                    ProgressView()
                }
            } else if isLoading {
                ProgressView()
            } else if let errorMessage = errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
            } else {
                Text("No user data")
            }
            
            Button("Fetch user") {
                fetchUser()
            }
            .disabled(isLoading)
        }
        .padding()
    }
    
    func fetchUser() {
        isLoading = true
        errorMessage = nil
        
        guard let url = URL(string: "https://randomuser.me/api/") else {
            errorMessage = "Invalid URL"
            isLoading = false
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, _, error in
            DispatchQueue.main.async {
                isLoading = false
                
                if let error = error {
                    errorMessage = error.localizedDescription
                    return
                }
                
                guard let data = data else {
                    errorMessage = "No data received"
                    return
                }
                
                do {
                    let decoded = try JSONDecoder().decode(APIResponse.self, from: data)
                    self.user = decoded.results.first
                } catch {
                    errorMessage = "Failed to decode response: \(error.localizedDescription)"
                }
            }
        }.resume()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
