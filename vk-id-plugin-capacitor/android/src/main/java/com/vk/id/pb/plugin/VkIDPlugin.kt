package com.vk.id.pb.plugin

import android.content.Intent
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "VkID")
class VkIDPlugin : Plugin() {
    private val implementation = VkID()
    @PluginMethod
    fun auth(call: PluginCall) {
        val value = call.getString("clientId")
        val ret = JSObject()

        ret.put("value", implementation.echo(value))
        call.resolve(ret)
    }
}
