<?php

/* modules/page_manager/page_manager_ui/templates/page-manager-wizard-tree.html.twig */
class __TwigTemplate_8202693de629c2f0379582a4c3477c41e82b085a4ed4e37d2320e8b7aee203bd extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $tags = array("import" => 20, "macro" => 28, "if" => 30, "for" => 33, "set" => 35);
        $filters = array();
        $functions = array("attach_library" => 18, "link" => 43);

        try {
            $this->env->getExtension('sandbox')->checkSecurity(
                array('import', 'macro', 'if', 'for', 'set'),
                array(),
                array('attach_library', 'link')
            );
        } catch (Twig_Sandbox_SecurityError $e) {
            $e->setTemplateFile($this->getTemplateName());

            if ($e instanceof Twig_Sandbox_SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

        // line 17
        echo "
";
        // line 18
        echo $this->env->getExtension('sandbox')->ensureToStringAllowed($this->env->getExtension('drupal_core')->escapeFilter($this->env, $this->env->getExtension('drupal_core')->attachLibrary("page_manager_ui/page_variants"), "html", null, true));
        echo "

";
        // line 20
        $context["page_manager"] = $this;
        // line 21
        echo "
";
        // line 26
        echo $this->env->getExtension('sandbox')->ensureToStringAllowed($this->env->getExtension('drupal_core')->renderVar($context["page_manager"]->getwizard_tree((isset($context["tree"]) ? $context["tree"] : null), (isset($context["step"]) ? $context["step"] : null), 0)));
        echo "

";
    }

    // line 28
    public function getwizard_tree($__items__ = null, $__step__ = null, $__menu_level__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals(array(
            "items" => $__items__,
            "step" => $__step__,
            "menu_level" => $__menu_level__,
            "varargs" => $__varargs__,
        ));

        $blocks = array();

        ob_start();
        try {
            // line 29
            echo "  ";
            $context["page_manager"] = $this;
            // line 30
            echo "  ";
            if ((isset($context["items"]) ? $context["items"] : null)) {
                // line 31
                echo "    <ul class=\"page__section__";
                echo $this->env->getExtension('sandbox')->ensureToStringAllowed($this->env->getExtension('drupal_core')->escapeFilter($this->env, (isset($context["menu_level"]) ? $context["menu_level"] : null), "html", null, true));
                echo "\">

    ";
                // line 33
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable((isset($context["items"]) ? $context["items"] : null));
                foreach ($context['_seq'] as $context["_key"] => $context["item"]) {
                    // line 34
                    echo "      ";
                    if (((isset($context["step"]) ? $context["step"] : null) === $this->getAttribute($context["item"], "step", array()))) {
                        // line 35
                        echo "        ";
                        $context["active_class"] = " current_variant";
                        // line 36
                        echo "      ";
                    } else {
                        // line 37
                        echo "        ";
                        $context["active_class"] = "";
                        // line 38
                        echo "      ";
                    }
                    // line 39
                    echo "      <li class=\"page__section_item__";
                    echo $this->env->getExtension('sandbox')->ensureToStringAllowed($this->env->getExtension('drupal_core')->escapeFilter($this->env, (isset($context["menu_level"]) ? $context["menu_level"] : null), "html", null, true));
                    echo $this->env->getExtension('sandbox')->ensureToStringAllowed($this->env->getExtension('drupal_core')->escapeFilter($this->env, (isset($context["active_class"]) ? $context["active_class"] : null), "html", null, true));
                    echo "\">
        <label class=\"page__section__label\">
          ";
                    // line 41
                    if ($this->getAttribute($context["item"], "url", array())) {
                        // line 42
                        echo "            ";
                        if (((isset($context["step"]) ? $context["step"] : null) === $this->getAttribute($context["item"], "step", array()))) {
                            // line 43
                            echo "              <strong>";
                            echo $this->env->getExtension('sandbox')->ensureToStringAllowed($this->env->getExtension('drupal_core')->escapeFilter($this->env, $this->env->getExtension('drupal_core')->getLink($this->getAttribute($context["item"], "title", array()), $this->getAttribute($context["item"], "url", array())), "html", null, true));
                            echo "</strong>
            ";
                        } else {
                            // line 45
                            echo "              ";
                            echo $this->env->getExtension('sandbox')->ensureToStringAllowed($this->env->getExtension('drupal_core')->escapeFilter($this->env, $this->env->getExtension('drupal_core')->getLink($this->getAttribute($context["item"], "title", array()), $this->getAttribute($context["item"], "url", array())), "html", null, true));
                            echo "
            ";
                        }
                        // line 47
                        echo "          ";
                    } else {
                        // line 48
                        echo "            ";
                        echo $this->env->getExtension('sandbox')->ensureToStringAllowed($this->env->getExtension('drupal_core')->escapeFilter($this->env, $this->getAttribute($context["item"], "title", array()), "html", null, true));
                        echo "
          ";
                    }
                    // line 50
                    echo "        </label>
        ";
                    // line 51
                    if ($this->getAttribute($context["item"], "children", array())) {
                        // line 52
                        echo "          ";
                        echo $this->env->getExtension('sandbox')->ensureToStringAllowed($this->env->getExtension('drupal_core')->renderVar($context["page_manager"]->getwizard_tree($this->getAttribute($context["item"], "children", array()), (isset($context["step"]) ? $context["step"] : null), ((isset($context["menu_level"]) ? $context["menu_level"] : null) + 1))));
                        echo "
        ";
                    }
                    // line 54
                    echo "      </li>
    ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['item'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 56
                echo "    </ul>
  ";
            }
        } catch (Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Twig_Markup($tmp, $this->env->getCharset());
    }

    public function getTemplateName()
    {
        return "modules/page_manager/page_manager_ui/templates/page-manager-wizard-tree.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  159 => 56,  152 => 54,  146 => 52,  144 => 51,  141 => 50,  135 => 48,  132 => 47,  126 => 45,  120 => 43,  117 => 42,  115 => 41,  108 => 39,  105 => 38,  102 => 37,  99 => 36,  96 => 35,  93 => 34,  89 => 33,  83 => 31,  80 => 30,  77 => 29,  63 => 28,  56 => 26,  53 => 21,  51 => 20,  46 => 18,  43 => 17,);
    }

    public function getSource()
    {
        return "{#
/**
 * @file
 * Default theme implementation to display wizard tree.
 *
 * Available variables:
 * - step: The current step name.
 * - tree: A nested list of menu items. Each menu item contains:
 *   - title: The menu link title.
 *   - url: The menu link url, instance of \\Drupal\\Core\\Url
 *   - children: The menu item child items.
 *   - step: The name of the step.
 *
 * @ingroup themeable
 */
#}

{{ attach_library('page_manager_ui/page_variants') }}

{% import _self as page_manager %}

{#
  We call a macro which calls itself to render the full tree.
  @see http://twig.sensiolabs.org/doc/tags/macro.html
#}
{{ page_manager.wizard_tree(tree, step, 0) }}

{% macro wizard_tree(items, step, menu_level) %}
  {% import _self as page_manager %}
  {% if items %}
    <ul class=\"page__section__{{ menu_level }}\">

    {% for item in items %}
      {% if step is same as(item.step) %}
        {% set active_class = \" current_variant\" %}
      {% else %}
        {% set active_class = \"\" %}
      {% endif %}
      <li class=\"page__section_item__{{ menu_level }}{{ active_class }}\">
        <label class=\"page__section__label\">
          {% if item.url %}
            {% if step is same as(item.step) %}
              <strong>{{ link(item.title, item.url) }}</strong>
            {% else %}
              {{ link(item.title, item.url) }}
            {% endif %}
          {% else %}
            {{ item.title }}
          {% endif %}
        </label>
        {% if item.children %}
          {{ page_manager.wizard_tree(item.children, step, menu_level + 1) }}
        {% endif %}
      </li>
    {% endfor %}
    </ul>
  {% endif %}
{% endmacro %}
";
    }
}
