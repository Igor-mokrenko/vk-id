import Foundation
import Capacitor
import VKID

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(VkIDPlugin)
public class VkIDPlugin: CAPPlugin {

    @objc func auth(_ call: CAPPluginCall) {
        guard let clientId = call.getString("clientId") else {
          call.reject("Must provide an clientId")
          return
        }

        guard let clientSecret = call.getString("clientSecret") else {
          call.reject("Must provide an clientSecret")
          return
        }

        guard let state = call.getString("state") else {
          call.reject("Must provide an state")
          return
        }

        guard let codeChallenge = call.getString("codeChallenge") else {
          call.reject("Must provide an codeChallenge")
          return
        }

        guard let scope = call.getArray("scope") else {
          call.reject("Must provide an scope")
          return
        }

        let scopeSet: Set<String>
        let scopeStrings = scope.compactMap { $0 as? String }
        guard scopeStrings.count == scope.count else {
            call.reject("All elements of scope must be strings")
            return
        }

        scopeSet = Set(scopeStrings)


        DispatchQueue.main.async {
            do {
                let vkid = try VKID(
                    config: Configuration(
                        appCredentials: AppCredentials(
                            clientId: clientId,         // ID вашего приложения (app_id)
                            clientSecret: clientSecret  // ваш защищенный ключ (client_secret)
                        )
                    )
                )

                let bottomSheet = self.getBottomSheet(_: call, codeChallenge, state, scopeSet)
                let sheetViewController = vkid.ui(for: bottomSheet).uiViewController()

                self.bridge?.viewController?.present(sheetViewController, animated: true, completion: nil)

            } catch {
                self.reject(call, error)
            }
        }
    }

    func getBottomSheet(_ call: CAPPluginCall, _ codeChallenge: String, _ state: String, _ scope: Set<String>) -> OneTapBottomSheet {
        let serviceName = Bundle.main.infoDictionary?["CFBundleDisplayName"] as? String
        return OneTapBottomSheet(
            serviceName: serviceName ?? "",
            targetActionText: .signIn,
            oneTapButton: .init(
                height: .medium(.h44),
                cornerRadius: 8
            ),
            authConfiguration: .init(
                flow: .confidentialClientFlow(codeExchanger: AuthCodeExchanger(), pkce: PKCESecrets(codeChallenge: codeChallenge, state: state)),
                scope: Scope(scope)
            ),
            theme: .matchingColorScheme(.system),
            autoDismissOnSuccess: true
        ) { authResult in
            do {
                let result = try authResult.get()
                let decoder = JSONDecoder()
                let jsonData = result.accessToken.value.data(using: .utf8)!
                let authFlowData = try decoder.decode(AuthCode.self, from: jsonData)

                self.resolve(call, authFlowData)
            } catch {
                if case AuthError.cancelled = error {
                    print("VKID: cancelled")
                } else {
                    self.reject(call, error)
                }
            }
        }
    }

    func resolve(_ call: CAPPluginCall, _ data: AuthCode) {
        call.resolve([
            "data": [
                "code": data.code,
                "deviceId": data.deviceId,
                "state": data.state,
                "redirectURI": data.redirectURI
            ],
            "success": true,
        ])
    }

    func reject(_ call: CAPPluginCall, _ error: Error) {
        call.resolve([
            "success": false,
            "error": "Failed to initialize VKID: \(error)"
        ])
    }
}

public class AuthCodeExchanger: AuthCodeExchanging {
    public func exchangeAuthCode(
        _ code: AuthorizationCode,
        completion: @escaping (Result<AuthFlowData, Error>) -> Void
    ) {
        do {
            let encoder = JSONEncoder()
            let userId = UserID(value: 123)
            let refreshToken = RefreshToken(userId: userId, value: "", scope: Scope([]))
            let idToken = IDToken(userId: userId, value: "")
            let jsonData = try encoder.encode(AuthCode(state: code.state, code: code.code, deviceId: code.deviceId, redirectURI: code.redirectURI))
            let deviceId = String(data: jsonData, encoding: .utf8)
            let accessToken = AccessToken(userId: userId, value: deviceId ?? "", expirationDate: Date(), scope: Scope([]))
            let authFlowData = AuthFlowData(accessToken: accessToken, refreshToken: refreshToken, idToken: idToken, deviceId: deviceId ?? "")
            
            completion(.success(authFlowData))
        } catch {
            completion(.failure(error))
        }
    }
}


public struct AuthCode: Codable {
    public let state: String
    public let code: String
    public let deviceId: String
    public let redirectURI: String
}
