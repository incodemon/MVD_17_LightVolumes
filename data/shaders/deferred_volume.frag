#version 330

//light structs and uniforms
struct Light {
    vec4 position;
    vec4 direction;
    vec4 color;
    float linear_att;
    float quadratic_att;
    float spot_inner_cosine;
    float spot_outer_cosine;
    mat4 view_projection;
    int type; // 0 - directional; 1 - point; 2 - spot
    int cast_shadow; // 0 - false; 1 - true
};

uniform int u_light_id;

const int MAX_LIGHTS = 8;
layout (std140) uniform u_lights_ubo
{
    Light lights[MAX_LIGHTS];
};


out vec4 fragColor;

uniform sampler2D u_tex_position;
uniform sampler2D u_tex_normal;
uniform sampler2D u_tex_albedo;

void main() {
	vec2 uv = gl_FragCoord.xy / textureSize(u_tex_position, 0).xy; //between 0 -1;

	vec3 position = texture(u_tex_position,uv).xyz;
	vec3 N = texture(u_tex_normal,uv).xyz;
	vec4 albedo_spec = texture(u_tex_albedo,uv);
	//for directional light
	vec3 L = -normalize(lights[u_light_id].direction.xyz);

	vec3 final_color = vec3(0);
	float attenuation = 1.0;

	if(lights[u_light_id].type > 0 ){
		vec3 point_to_light = lights[u_light_id].position.xyz - position;
		vec3 L = normalize(point_to_light);

		float distance = length(point_to_light);
		attenuation = 1.0 / (1.0 + 
		lights[u_light_id].linear_att * distance + lights[u_light_id].quadratic_att * (distance * distance));
	}

	float NdotL = max(0.0, dot(N,L));
	vec3 diffuse_color = NdotL * albedo_spec.xyz * lights[u_light_id].color.xyz;

	final_color = diffuse_color * attenuation;
	fragColor = vec4(final_color, 1.0);

}
